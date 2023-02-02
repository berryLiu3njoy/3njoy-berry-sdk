import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
    }),
  ],
  build: {
    target: 'modules',
    outDir: 'dist',
    minify: true,

    rollupOptions: {
      external: ['vue', 'lodash-es', 'aptos', 'eventemitter3', '@berryliu/aptos-wallet-adapter'],
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
      name: 'AptosWalletAdapterUI',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
});

