/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: { exclude: ['swiper/react', 'swiper/swiper.min.css', 'swiper/modules/pagination/pagination.min.css'] },
  esbuild: {
  },
  plugins: [eslintPlugin({ cache: false }), react()],
});
