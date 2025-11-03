import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// Only add the visualizer plugin in analyze mode
const isAnalyze = process.env.ANALYZE === 'true';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        isAnalyze && visualizer({
          filename: './dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      ].filter(Boolean), // Remove false values when not analyzing
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Split vendor code into separate chunks to improve caching
              'react-vendor': ['react', 'react-dom'],
              'audio-vendor': ['@google/genai'], // Group AI related libraries
            }
          }
        },
        // Enable more aggressive tree-shaking and minification
        minify: 'esbuild', // Use esbuild for faster builds, or 'terser' for smaller bundles
        cssCodeSplit: true, // Split CSS into smaller chunks
        sourcemap: false, // Disable sourcemaps in production for smaller bundle size
      },
      optimizeDeps: {
        include: [
          // Pre-bundle commonly used dependencies
          'react',
          'react-dom',
          '@google/genai',
        ]
      }
    };
});
