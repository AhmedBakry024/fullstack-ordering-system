import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030, // Ensure the port is correctly set
    open: true, // Automatically open the browser on server start
  },
  resolve: {
    alias: {
      '@': '/src', 
    },
  },
});
