import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import {
  typedown,
} from 'typerighter/vite';
import {
  defineConfig,
} from 'vite';

const __dirname = new URL('.', import.meta.url).pathname;

export default defineConfig({
  base: '/sqlingo/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
  build: {
    outDir: '../doc',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('node_modules/vue/')) return 'vue';
          if (id.includes('highlight.js/')) return 'hljs';
        },
      },
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
  plugins: [
    vue(),
    tailwindcss(),
    ...typedown({
      root: 'api-reference',
    }),
  ],
});
