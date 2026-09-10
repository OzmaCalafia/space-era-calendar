import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      'space-era-calendar': path.resolve(__dirname, '../javascript/src/core.js')
    }
  }
});
