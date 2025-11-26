// Environment configuration for Vite
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  UNSPLASH_KEY: import.meta.env.VITE_UNSPLASH_KEY || '',
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyB37WnyXwPAlF_rzPS-UjoLu0Ve2dPr3Uo',
};

// Validate that required keys are present
if (!config.UNSPLASH_KEY) {
  console.warn('VITE_UNSPLASH_KEY is not set in environment variables');
}

if (!config.GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set in environment variables');
}
