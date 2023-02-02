import { createGlobalState } from '@vueuse/shared';
import { ref } from 'vue';
import { AbstractWallet } from '../../wallets/AbstractWallet';
import { useConnect } from './useConnect';

const DEFAULT_LS_KEY = 'adapter-wallket-key';

export const walletStore = createGlobalState(() => {
  const name = ref('');
  const icon = ref('');
  const walletProvider = ref<any>(null);
  const isConnected = ref(false);
  const connecting = ref(false);
  const walletModalOpen = ref(false);
  const address = ref('');
  const publicKey = ref('');
  const localstorageKey = ref(DEFAULT_LS_KEY);
  const walletList = ref<AbstractWallet[]>([]);

  const clear = () => {
    name.value = '';
    icon.value = '';
    address.value = '';
    walletProvider.value = {};
    isConnected.value = false;
    connecting.value = false;
    walletModalOpen.value = false;
    window.localStorage.removeItem(localstorageKey.value);
  };

  return {
    address,
    publicKey,
    name,
    icon,
    walletList,
    localstorageKey,
    walletProvider,
    walletModalOpen,
    isConnected,
    connecting,

    clear,
  };
})();

export function useWallet() {
  const { connectWallet } = useConnect();

  const chooseWallet = async (wallet: any) => {
    return await connectWallet(wallet);
  };

  return {
    chooseWallet,
  };
}

