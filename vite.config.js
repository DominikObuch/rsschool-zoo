import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'pages/landing/index.html'),
        map:     resolve(__dirname, 'pages/map/index.html'),
        zoo:     resolve(__dirname, 'pages/zoo/index.html'),
        contact: resolve(__dirname, 'pages/contact/index.html'),
      },
    },
  },
});
