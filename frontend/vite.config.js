import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/static/pages/',
  build: {
    manifest: true,
    outDir: resolve('../pages/static/pages/'),
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'scripts/main.js'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  publicDir: 'public',
  server: {
    origin: 'http://localhost:5173',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    }
  }
});

