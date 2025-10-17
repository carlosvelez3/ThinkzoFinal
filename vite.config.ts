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
  };
});
