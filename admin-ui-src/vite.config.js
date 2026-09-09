import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the admin React app straight into the plugin's assets/admin/ folder
// with stable filenames so PHP can enqueue them.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/admin',
    emptyOutDir: true,
    // The shipped bundle is deliberately unminified (wp.org human-readable code).
    minify: false,
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'index.[ext]',
        manualChunks: undefined,
      },
    },
  },
});
