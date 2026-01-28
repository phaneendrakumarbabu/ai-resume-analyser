// Structured logging utility with sensitive data protection

import type { EnvConfig, ValidationResult } from './config/envValidator';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogContext {
  [key: string]: any;
}

/**
 * Masks an API key for safe logging
 * @param key - The API key to mask
 * @returns Masked representation showing only first 15 characters
 */
export function maskApiKey(key: string | undefined): string {
  if (!key) return 'not set';
  if (key.length < 15) return '***';
  return `${key.substring(0, 15)}...`;
}

/**
 * Logs comprehensive environment configuration details
 * @param config - The environment configuration
 * @param validation - The validation result
 */
export function logEnvConfig(config: EnvConfig, validation: ValidationResult): void {
  console.group('🔧 Environment Configuration');
  console.log('Mode:', config.isProduction ? 'Production' : 'Development');
  console.log('API Key Present:', !!config.geminiApiKey);
  console.log('API Key Length:', config.geminiApiKey?.length || 0);
  console.log('API Key Prefix:', maskApiKey(config.geminiApiKey));
  console.log('Validation Status:', validation.isValid ? '✅ Valid' : '❌ Invalid');
  
  if (!validation.isValid && validation.error) {
    console.error('Validation Error:', validation.error);
  }
  
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn('Warnings:', validation.warnings);
  }
  
  // Log all VITE_ prefixed env vars (for debugging)
  const viteEnvVars = Object.keys(import.meta.env)
    .filter(key => key.startsWith('VITE_'))
    .reduce((acc, key) => {
      acc[key] = key.includes('KEY') || key.includes('SECRET') 
        ? maskApiKey(import.meta.env[key])
        : import.meta.env[key];
      return acc;
    }, {} as Record<string, any>);
  
  console.log('Environment Variables:', viteEnvVars);
  console.groupEnd();
}

/**
 * Structured logging with timestamp and level
 * @param level - The log level
 * @param message - The log message
 * @param context - Optional context object
 */
export function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(prefix, message, context || '');
      break;
    case LogLevel.INFO:
      console.info(prefix, message, context || '');
      break;
    case LogLevel.WARN:
      console.warn(prefix, message, context || '');
      break;
    case LogLevel.ERROR:
      console.error(prefix, message, context || '');
      break;
  }
}
