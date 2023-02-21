import { isEmpty } from 'lodash-es';
import { ref } from 'vue';
import { AbstractWallet } from '../../wallets/AbstractWallet';

import { walletStore } from '../hooks/useWallet';

export function useConnect() {
  const isconnected = ref(false);
  const loading = ref(false);

  const disconnect = async ({ cb }: { cb?: Function } = {}) => {
    try {
      isconnected.value = false;
      localStorage.removeItem(walletStore.localstorageKey.value);

      if (walletStore.walletProvider.value.disconnect) {
        await walletStore.walletProvider.disconnect();
        walletStore.walletProvider.value = {};
        cb?.();
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const connectWallet = async (wallet?: any) => {
    try {
      if (loading.value) return;
      const p = wallet || walletStore.walletProvider.value;

      if (!p?.connect) {
        return;
      }

      loading.value = true;

      await p.connect();
      let currentWallet: any = {};

      walletStore.connecting.value = true;

      if (wallet?.name) {
        currentWallet = wallet;
        walletStore.isConnected.value = true;
      } else {
        currentWallet = walletStore.walletProvider.value;
      }

      currentWallet.onAccountChange();
      currentWallet.onNetworkChange();

      currentWallet.on('accountChange', (address: string) => walletStore.address.value = address)
      currentWallet.on('networkChange', (network: string) => walletStore.network.value = network)

      localStorage.setItem(walletStore.localstorageKey.value, p.name);
      walletStore.walletProvider.value = currentWallet;
      walletStore.address.value = p.account.address;
      walletStore.publicKey.value = p.account.publicKey;
      walletStore.name.value = p.name;
      walletStore.icon.value = p.icon;
      walletStore.network.value = p.network?.name;

      return p.account;
    } catch (e) {
      console.log(e);
    } finally {
      loading.value = false;
      walletStore.connecting.value = false;
    }
  };

  const autoConnect = async () => {
    const walletName = localStorage.getItem(walletStore.localstorageKey.value);
    const connectdWallet: AbstractWallet[] = walletStore.walletList.value.filter(
      (wallet: any) => wallet.name === walletName,
    );

    if (!isEmpty(connectdWallet)) {
      walletStore.walletProvider.value = connectdWallet[0];
      walletStore.name.value = connectdWallet[0].name;
      walletStore.icon.value = connectdWallet[0].icon;
      connectWallet();
    }
  };

  return {
    isconnected,
    disconnect,
    connectWallet,

    autoConnect,
  };
}

