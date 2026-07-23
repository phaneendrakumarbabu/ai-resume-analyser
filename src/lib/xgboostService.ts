import { log, LogLevel } from './logger';

export interface XGBoostAnalysisResult {
  matchPercentage: number;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  detailedFeedback: string;
  modelType?: string;
  isAIPowered?: boolean;
}

interface XGBoostConfig {
  apiUrl: string;
  timeout: number;
  enabled: boolean;
}

// Configuration for XGBoost service
const config: XGBoostConfig = {
  apiUrl: import.meta.env.VITE_XGBOOST_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  enabled: import.meta.env.VITE_XGBOOST_ENABLED !== 'false', // Enabled by default
};

/**
 * Check if XGBoost service is available and healthy
 */
export async function isXGBoostAvailable(): Promise<boolean> {
  if (!config.enabled) {
    log(LogLevel.DEBUG, 'XGBoost service is disabled via configuration');
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduced to 2 seconds for faster fallback

    const response = await fetch(`${config.apiUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      log(LogLevel.INFO, 'XGBoost service health check', { status: data.status, modelsLoaded: data.models_loaded });
      return data.status === 'healthy' && data.models_loaded === true;
    }

    return false;
  } catch (error: any) {
    log(LogLevel.DEBUG, 'XGBoost service not available', { 
      error: error.message,
      apiUrl: config.apiUrl 
    });
    return false;
  }
}

/**
 * Analyze resume using XGBoost ML model
 */
export async function analyzeResumeWithXGBoost(
  resumeText: string,
  roleId: string,
  roleName: string,
  requiredSkills: string[]
): Promise<XGBoostAnalysisResult> {
  log(LogLevel.INFO, 'Starting XGBoost analysis', { 
    roleName, 
    roleId, 
    textLength: resumeText.length 
  });

  if (!config.enabled) {
    throw new Error('XGBoost service is disabled');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(`${config.apiUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText,
        roleId,
        roleName,
        requiredSkills,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    log(LogLevel.INFO, 'XGBoost analysis complete', {
      matchPercentage: result.matchPercentage,
      atsScore: result.atsScore,
      modelType: result.modelType,
    });

    return {
      matchPercentage: result.matchPercentage,
      atsScore: result.atsScore,
      matchedSkills: result.matchedSkills || [],
      missingSkills: result.missingSkills || [],
      suggestions: result.suggestions || [],
      detailedFeedback: result.detailedFeedback || '',
      modelType: result.modelType || 'xgboost',
      isAIPowered: true,
    };
  } catch (error: any) {
    log(LogLevel.ERROR, 'XGBoost Analysis Error', {
      errorType: error?.constructor?.name,
      message: error?.message,
    });

    // Enhanced error handling
    if (error.name === 'AbortError') {
      throw new Error('XGBoost analysis timed out. Please try again.');
    } else if (error.message?.includes('Failed to fetch') || error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to XGBoost service. Please ensure the ML service is running.');
    } else if (error.message?.includes('Models not loaded')) {
      throw new Error('XGBoost models not initialized. Please train the models first.');
    }

    throw new Error(error.message || 'Failed to analyze resume with XGBoost. Please try again.');
  }
}

/**
 * Get available job roles from XGBoost service
 */
export async function getXGBoostRoles(): Promise<Record<string, string[]>> {
  try {
    const response = await fetch(`${config.apiUrl}/roles`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.roles || {};
  } catch (error: any) {
    log(LogLevel.ERROR, 'Failed to fetch roles from XGBoost service', { error: error.message });
    return {};
  }
}

/**
 * Configure XGBoost service
 */
export function configureXGBoost(options: Partial<XGBoostConfig>) {
  Object.assign(config, options);
  log(LogLevel.INFO, 'XGBoost configuration updated', config);
}

/**
 * Get current XGBoost configuration
 */
export function getXGBoostConfig(): XGBoostConfig {
  return { ...config };
}
