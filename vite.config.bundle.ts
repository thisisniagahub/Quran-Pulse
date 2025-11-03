import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// Only add the visualizer plugin in analyze mode
const isAnalyze = process.env.ANALYZE === 'true';

export default defineConfig({
  plugins: [
    react(),
    isAnalyze && visualizer({
      filename: './dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean), // Remove false values when not analyzing
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@heroicons/react'], // If using any UI libraries
          'utils-vendor': ['date-fns', 'lodash'], // If using utility libraries
          'ai-vendor': ['@google/genai'], // AI related libraries
        }
      }
    },
    // Enable more aggressive tree-shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true, // Remove debugger statements
      },
      format: {
        comments: false, // Remove comments in production
      }
    },
  },
  optimizeDeps: {
    include: [
      // Pre-bundle large dependencies
      'react',
      'react-dom',
      '@google/genai',
    ]
  }
});