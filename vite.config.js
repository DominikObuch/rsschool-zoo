import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { templateCompilerOptions } from '@tresjs/core';

const entries = {
  index: resolve(__dirname, 'index.html'),
  'pages/landing/index': resolve(__dirname, 'pages/landing/index.html'),
  'pages/map/index': resolve(__dirname, 'pages/map/index.html'),
  'pages/zoo/index': resolve(__dirname, 'pages/zoo/index.html'),
  'pages/contact/index': resolve(__dirname, 'pages/contact/index.html'),
  'pages/panda/index': resolve(__dirname, 'pages/panda/index.html'),
  'pages/gorilla/index': resolve(__dirname, 'pages/gorilla/index.html'),
  'pages/lemur/index': resolve(__dirname, 'pages/lemur/index.html'),
  'pages/eagle/index': resolve(__dirname, 'pages/eagle/index.html'),
  'pages/login/index': resolve(__dirname, 'pages/login/index.html'),
  'pages/register/index': resolve(__dirname, 'pages/register/index.html'),
};

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.GITHUB_ACTIONS === 'true' && repoName ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  plugins: [vue(templateCompilerOptions)],
  resolve: {
    alias: {
      '@virtual-tour': resolve(__dirname, 'components/virtual-tour')
    }
  },
  build: {
    rollupOptions: {
      input: entries,
    },
  },
});
