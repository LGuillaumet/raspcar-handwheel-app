/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: { exclude: ['swiper/react', 'swiper/swiper.min.css', 'swiper/modules/pagination/pagination.min.css'] },
  build: {
    minify: false,
    sourcemap: true // < this allows the browser to point you to the correct file

  },

  plugins: [eslintPlugin({ cache: false }), react()],
});
