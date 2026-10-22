import { defineConfig } from 'vite';

export default defineConfig({
  // Relative assets also work under the repository path used by GitHub Pages.
  base: process.env.VITE_BASE_PATH || './',
});
