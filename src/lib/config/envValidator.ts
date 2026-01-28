// Environment validation module for AI API configuration

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export interface EnvConfig {
  geminiApiKey: string | undefined;
  isProduction: boolean;
  isDevelopment: boolean;
}

// Validation constants for Gemini API key
const GEMINI_KEY_MIN_LENGTH = 20;

/**
 * Validates a Gemini API key against format and length requirements
 * @param key - The API key to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateGeminiKey(key: string | undefined): ValidationResult {
  // Check if key exists
  if (key === undefined) {
    return {
      isValid: false,
      error: 'Gemini API key is not set. Please add VITE_GEMINI_API_KEY to your .env file'
    };
  }
  
  // Trim whitespace
  const trimmedKey = key.trim();
  
  // Check if empty
  if (trimmedKey.length === 0) {
    return {
      isValid: false,
      error: 'Gemini API key is empty. Please check your .env file'
    };
  }
  
  // Check minimum length
  if (trimmedKey.length < GEMINI_KEY_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Gemini API key appears invalid (too short). Expected at least ${GEMINI_KEY_MIN_LENGTH} characters, got ${trimmedKey.length}`
    };
  }
  
  return { isValid: true };
}

/**
 * Retrieves environment configuration from Vite's import.meta.env
 * @returns EnvConfig object with API key and environment flags
 */
export function getEnvConfig(): EnvConfig {
  return {
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV
  };
}

/**
 * Validates the current environment configuration
 * @returns ValidationResult for the environment's API key
 */
export function validateEnvironment(): ValidationResult {
  const config = getEnvConfig();
  const keyValidation = validateGeminiKey(config.geminiApiKey);
  
  return keyValidation;
}
