import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            '%VITE_RECAPTCHA_SITE_KEY%',
            env.VITE_RECAPTCHA_SITE_KEY || ''
          );
        },
      },
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'react-vendor': ['react', 'react-dom'],
            'animation-vendor': ['framer-motion'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'form-vendor': ['react-hot-toast'],
          },
        },
      },
      // Increase chunk size warning limit since we're splitting properly
      chunkSizeWarningLimit: 600,
    },
  };
});
