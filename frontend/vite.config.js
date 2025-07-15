import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/static/pages/',
    build: {
        manifest: true,
        outDir: resolve('../pages/static/pages/'),
        assetsDir: '',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'scripts/main.js'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'main.css') return 'styles.css';
                    return '[name][extname]';
                }
            }
        },
    },
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

