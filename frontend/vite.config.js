
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        manifest: true,
        outDir: resolve('../pages/static/pages/'),
        assetsDir: '',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'scripts/main.js'),
                styles: resolve(__dirname, 'styles/main.scss'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]'
            }
        },
    },
});

