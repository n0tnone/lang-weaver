import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          editor: ['@monaco-editor/react'],
          ui: ['lucide-react', 'react-data-grid']
        }
      }
    },
    minify: 'esbuild',
    sourcemap: false
  },
  server: {
    port: 5173
  },
  json: {
    stringify: false
  }
});