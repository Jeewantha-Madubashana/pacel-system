import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get backend port from environment or default to 5000
const BACKEND_PORT = process.env.VITE_BACKEND_PORT || process.env.BACKEND_PORT || 5000;
const WEB_PORT = process.env.PORT || 3000;

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(WEB_PORT),
    proxy: {
      '/api': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
});

