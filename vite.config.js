import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '',
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@images': path.resolve(__dirname, 'public/images')
    },
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    outDir: 'docs',
    assetsDir: '',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return '[name][extname]'
          }
          return 'assets/[name].[hash][extname]'
        }
      }
    }
  },
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  }
});