import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'app',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './web/components.vue'
      },
      shared: ['vue', 'app2-common']
    })
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: './web/index.ts'
    }
  }
});
