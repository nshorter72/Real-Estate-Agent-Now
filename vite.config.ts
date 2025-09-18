import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Real-Estate-Agent-Now/',
  plugins: [react()],
  server: {
    open: true
  }
});
