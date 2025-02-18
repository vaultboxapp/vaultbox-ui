import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'vaultbox',
    port: 4001,
    proxy :{
      '/socket.io': {
        target: 'http://vaultbox', // Match your Nginx config
        ws: true,
        changeOrigin: true,
        secure: false, // Disable SSL verification if needed
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});