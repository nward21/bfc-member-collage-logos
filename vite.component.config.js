import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: 'src/web-component.jsx',
      name: 'BfcLogoGrid',
      fileName: 'bfc-logo-grid',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'bfc-logo-grid.js',
        inlineDynamicImports: true
      }
    },
    minify: 'esbuild',
    outDir: 'dist/component'
  }
});
