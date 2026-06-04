import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // One vendor chunk so postbuild can drop modulepreload and protect LCP bandwidth.
          if (id.includes('node_modules')) {
            if (
              id.includes('react-router') ||
              id.includes('react-router-dom') ||
              /node_modules\/react(-dom)?\//.test(id)
            ) {
              return 'core-ui';
            }
          }
          return undefined;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    hmr: { overlay: false },
  },
});
