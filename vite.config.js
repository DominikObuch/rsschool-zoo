import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'pages/landing/index.html'),
        map:     resolve(__dirname, 'pages/map/index.html'),
        zoo:     resolve(__dirname, 'pages/zoo/index.html'),
        panda:   resolve(__dirname, 'pages/panda/index.html'),
        lemur:   resolve(__dirname, 'pages/lemur/index.html'),
        eagle:   resolve(__dirname, 'pages/eagle/index.html'),
        gorilla: resolve(__dirname, 'pages/gorilla/index.html'),
        contact: resolve(__dirname, 'pages/contact/index.html'),
      },
    },
  },
});
