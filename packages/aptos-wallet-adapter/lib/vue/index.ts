import { App, Plugin } from 'vue';
import { AbstractWallet } from '../wallets/AbstractWallet';
import wallet from './lib/wallet';

export { useWallet, walletStore } from './hooks/useWallet';
export { useConnect } from './hooks/useConnect';

export interface VueAdapterPluginOption {
  wallets?: AbstractWallet[];
  LS_KEY?: string;
}

export const AdapterVuePlugin = {
  install: (app: App, options: VueAdapterPluginOption) => {
    wallet(options);
  },
};

