import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateGeminiKey, getEnvConfig } from './config/envValidator';
import { log, LogLevel, maskApiKey } from './logger';

// Lazy initialization - only create client when needed
let geminiClient: GoogleGenerativeAI | null = null;
let validationCache: { isValid: boolean; error?: string } | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const config = getEnvConfig();
    const validation = validateGeminiKey(config.geminiApiKey);
    
    if (!validation.isValid) {
      log(LogLevel.ERROR, 'Gemini client initialization failed', {
        error: validation.error,
        keyPresent: !!config.geminiApiKey,
        keyPrefix: maskApiKey(config.geminiApiKey)
      });
      throw new Error(validation.error || 'Gemini API key not configured');
    }
    
    geminiClient = new GoogleGenerativeAI(config.geminiApiKey!.trim());
    
    log(LogLevel.INFO, 'Gemini client initialized successfully');
  }
  return geminiClient;
}

export interface AIAnalysisResult {
  matchPercentage: number;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  detailedFeedback: string;
}

export async function analyzeResumeWithAI(
  resumeText: string,
  roleId: string,
  roleName: string,
  requiredSkills: string[]
): Promise<AIAnalysisResult> {
  log(LogLevel.INFO, 'Starting AI analysis with Gemini', { roleName, skillCount: requiredSkills.length });
  
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const genAI = getGeminiClient();
      
      // Use the most reliable model consistently
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          temperature: 0.7,
        }
      });
      
      log(LogLevel.INFO, `Attempting analysis with gemini-2.5-flash-lite (attempt ${attempt})`);
      
      const prompt = `You are an expert resume analyzer and career coach. Analyze the following resume for a ${roleName} position.

Resume:
${resumeText}

Required Skills for ${roleName}:
${requiredSkills.join(', ')}

Please provide a detailed analysis in the following JSON format (respond with ONLY valid JSON, no markdown or additional text):
{
  "matchPercentage": <number 0-100>,
  "atsScore": <number 0-100>,
  "matchedSkills": [<array of skills found in resume from the required list>],
  "missingSkills": [<array of skills not found in resume from the required list>],
  "suggestions": [<array of 5 specific, actionable suggestions to improve the resume>],
  "detailedFeedback": "<2-3 paragraph detailed analysis of strengths and areas for improvement>"
}

Important:
- Be thorough in identifying skills, including variations and related technologies
- Consider context and experience level when matching skills
- Provide specific, actionable suggestions
- ATS score should consider formatting, keywords, and structure
- Match percentage should reflect how well the candidate fits the role
- Respond with ONLY the JSON object, no markdown formatting`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('No response from AI');
      }

      // Clean up the response - remove markdown code blocks if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }
      
      const analysisResult = JSON.parse(cleanedText);
      log(LogLevel.INFO, 'AI analysis complete', { 
        matchPercentage: analysisResult.matchPercentage, 
        atsScore: analysisResult.atsScore,
        attempt
      });
      return analysisResult as AIAnalysisResult;
    } catch (error: any) {
      lastError = error;
      
      log(LogLevel.ERROR, `AI Analysis Error (attempt ${attempt}/${maxRetries})`, {
        errorType: error?.constructor?.name,
        status: error?.status,
        message: error?.message
      });
      
      // Check if it's a retryable error (503, 429, timeout)
      const isRetryable = error?.status === 503 || 
                         error?.status === 429 || 
                         error?.message?.includes('overloaded') ||
                         error?.message?.includes('timeout') ||
                         error?.code === 'ENOTFOUND' || 
                         error?.code === 'ETIMEDOUT';
      
      if (!isRetryable || attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying (longer delays for server overload)
      const delay = Math.pow(2, attempt) * 2000; // 4s, 8s, 16s
      log(LogLevel.INFO, `Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Enhanced error handling with specific messages
  if (lastError?.message?.includes('API_KEY_INVALID') || lastError?.message?.includes('invalid API key')) {
    throw new Error('Invalid Gemini API key. Please verify your key at https://makersuite.google.com/app/apikey');
  } else if (lastError?.message?.includes('quota') || lastError?.message?.includes('RESOURCE_EXHAUSTED')) {
    throw new Error('Gemini API quota exceeded. Please check your usage at https://makersuite.google.com/');
  } else if (lastError?.status === 503 || lastError?.message?.includes('overloaded')) {
    throw new Error('Gemini servers are temporarily overloaded. Please try again in a few minutes.');
  } else if (lastError?.code === 'ENOTFOUND' || lastError?.code === 'ETIMEDOUT') {
    throw new Error('Network error connecting to Gemini. Please check your internet connection');
  } else if (lastError?.message?.includes('timeout')) {
    throw new Error('Gemini API request timed out. Please try again');
  } else if (lastError?.message?.includes('JSON')) {
    throw new Error('Failed to parse AI response. Please try again.');
  }
  
  throw new Error('Failed to analyze resume with AI. Please try again.');
}

export function isAIConfigured(): boolean {
  // Use cached validation result if available
  if (validationCache !== null) {
    return validationCache.isValid;
  }
  
  const config = getEnvConfig();
  const validation = validateGeminiKey(config.geminiApiKey);
  
  // Cache the result
  validationCache = validation;
  
  log(LogLevel.DEBUG, 'AI Configuration Check', {
    isConfigured: validation.isValid,
    error: validation.error,
    keyPresent: !!config.geminiApiKey,
    keyLength: config.geminiApiKey?.length || 0,
    keyPrefix: maskApiKey(config.geminiApiKey)
  });
  
  return validation.isValid;
}
