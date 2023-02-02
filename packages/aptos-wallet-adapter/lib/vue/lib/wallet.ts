import { walletStore } from '../hooks//useWallet';
import { VueAdapterPluginOption } from './../index';

export default (options: VueAdapterPluginOption) => {
  if (options.LS_KEY) {
    walletStore.localstorageKey.value = options.LS_KEY;
  }

  if (Array.isArray(options.wallets) && options.wallets.length > 0) {
    walletStore.walletList.value = options.wallets;
  }
};

