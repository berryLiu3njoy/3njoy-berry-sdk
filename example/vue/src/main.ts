import { createApp, Plugin } from 'vue';
import './style.css';
import '@berryliu/aptos-wallet-adapter-ui/dist/style.css';

import App from './App.vue';
import {
  AdapterVuePlugin,
  MartianWallet,
  FewchaWallet,
  PetraWallet,
  PontemWallet,
} from '@berryliu/aptos-wallet-adapter';
import { createPinia } from 'pinia';
import { AdapterWalletUI } from '@berryliu/aptos-wallet-adapter-ui';

const app = createApp(App);

app
  .use(createPinia())
  .use(AdapterWalletUI as Plugin)
  .use(AdapterVuePlugin as Plugin, {
    wallets: [new MartianWallet(), new FewchaWallet(), new PetraWallet(), new PontemWallet()],
    LS_KEY: 'demo-wallet',
  })
  .mount('#app');

