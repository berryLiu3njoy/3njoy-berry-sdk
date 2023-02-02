import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
    }),
  ],
  build: {
    target: 'modules',
    outDir: 'dist',

    rollupOptions: {
      external: ['vue', '@vueuse/shared', 'lodash-es', 'aptos', 'eventemitter3'],
      input: ['lib/index.ts'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          preserveModules: true,
          dir: 'dist',
        },
      ],
    },
    lib: {
      entry: './lib/index.ts',
      name: 'AptosWalletAdapter',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
});

