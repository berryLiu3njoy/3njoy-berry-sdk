import { App, Plugin } from 'vue';
import { AbstractWallet } from '../wallets/AbstractWallet';
import wallet from './lib/wallet';

export interface VueAdapterPluginOption {
  wallets?: AbstractWallet[];
  LS_KEY?: string;
}

export const AdapterVuePlugin = {
  install: (app: App, options: VueAdapterPluginOption) => {
    wallet(options);
  },
};

export * from './hooks/useWallet';
export * from './hooks/useConnect';


