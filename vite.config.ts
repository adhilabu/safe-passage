import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load all env variables (not just VITE_ prefixed ones)
    const env = loadEnv(mode, process.cwd(), '');
    // Support both API_KEY and GEMINI_API_KEY for backward compatibility
    const apiKey = env.API_KEY || env.GEMINI_API_KEY;
    console.log('🔧 Vite Config - API Key found:', apiKey ? 'YES' : 'NO');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
