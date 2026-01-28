// Test file to verify environment variables are loading
import { getEnvConfig, validateEnvironment } from './config/envValidator';
import { logEnvConfig } from './logger';

export function testEnvironment() {
  const config = getEnvConfig();
  const validation = validateEnvironment();
  
  logEnvConfig(config, validation);
  
  // Provide setup instructions if validation fails
  if (!validation.isValid) {
    console.group('📋 Setup Instructions');
    console.log('1. Create a .env file in the project root (if it doesn\'t exist)');
    console.log('2. Add the following line:');
    console.log('   VITE_GEMINI_API_KEY=your_actual_api_key_here');
    console.log('3. Get your API key from: https://makersuite.google.com/app/apikey');
    console.log('4. Restart the development server');
    console.groupEnd();
  }
}
