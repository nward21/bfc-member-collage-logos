import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bfc-member-collage-logos/',
  server: {
    port: 3000,
    open: true
  }
});
