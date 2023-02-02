import { App } from 'vue';
import WalletButton from './components/WalletButton.vue';

export const AdapterWalletUI = {
  install: (app: App) => {
    app.component('WalletButton', WalletButton);
  },
};

