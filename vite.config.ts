import { defineConfig } from 'vite';

const page = (path: string): string => new URL(path, import.meta.url).pathname;

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        landing: page('pages/landing/index.html'),
        map: page('pages/map/index.html'),
        zoo: page('pages/zoo/index.html'),
        panda: page('pages/panda/index.html'),
        lemur: page('pages/lemur/index.html'),
        eagle: page('pages/eagle/index.html'),
        gorilla: page('pages/gorilla/index.html'),
        contact: page('pages/contact/index.html'),
        login: page('pages/login/index.html'),
        register: page('pages/register/index.html'),
      },
    },
  },
});
