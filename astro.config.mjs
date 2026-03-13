import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://neetab.com',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'pdf-tools': ['pdfjs-dist', 'jspdf', 'html2canvas', 'mammoth', 'pdf-lib'],
            'image-tools': ['heic2any'],
            'scanner-tools': ['@zxing/browser'],
            'barcode-tools': ['jsbarcode'],
            'data-tools': ['papaparse'],
          },
        },
      },
    },
  },
});