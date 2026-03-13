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
    sitemap({
      serialize(item) {
        const url = item.url.replace(/\/$/, '');
        const lastmod = new Date();
        if (url === 'https://neetab.com') {
          return { ...item, lastmod, changefreq: 'daily', priority: 1.0 };
        }
        if (url.includes('/tools/')) {
          return { ...item, lastmod, changefreq: 'weekly', priority: 0.8 };
        }
        return { ...item, lastmod, changefreq: 'monthly', priority: 0.5 };
      },
    }),
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