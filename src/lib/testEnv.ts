// Test file to verify environment variables are loading
export function testEnvironment() {
  console.log('=== Environment Variable Test ===');
  console.log('All env vars:', import.meta.env);
  console.log('VITE_OPENAI_API_KEY exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
  console.log('VITE_OPENAI_API_KEY length:', import.meta.env.VITE_OPENAI_API_KEY?.length);
  console.log('VITE_OPENAI_API_KEY prefix:', import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 15));
  console.log('================================');
}
