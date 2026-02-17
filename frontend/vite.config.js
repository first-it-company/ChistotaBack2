import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '',
  build: {
    manifest: true,
    outDir: resolve('../pages/static/pages/'),
    assetsDir: 'assets',
    rollupOptions: {
      input: {
          main: resolve(__dirname, 'scripts/main.js'),
          critical: resolve(__dirname, 'scripts/critical.js'),
      },
        output: {
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            assetFileNames: '[name].[ext]',
            manualChunks: undefined
        }
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  publicDir: 'public',
    server: {
        port: 5173,
        strictPort: true,
        cors: true,
    }
});

