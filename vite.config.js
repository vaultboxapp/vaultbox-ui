import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://vaultbox',
        changeOrigin: true,
        secure: false, // use true if vaultbox has a valid SSL certificate
      },
      '/messages': {
        target: 'http://vaultbox',
        changeOrigin: true,
        secure: false,
      },
      '/channels': {
        target: 'http://vaultbox',
        changeOrigin: true,
        secure: false,
      },
      '/chat': {
        target: 'http://vaultbox',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});