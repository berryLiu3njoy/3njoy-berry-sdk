import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';

import { AbstractWallet, NetworkInfo, WalletAdapterNetwork } from './AbstractWallet';
import { BASIC_TRANSACTION_OPTION } from './config';

export class MartianWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/martian.svg';
  url = 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk';
  name = 'Martian Wallet';
  connecting = false;

  provider = window.martian || null;

  isInstalled = () => !!window.martian;

  account = {
    address: '',
    publicKey: '',
  };

  network: NetworkInfo = {
    name: undefined,
    chainId: '',
  };

  constructor() {
    super();
  }

  connect = async () => {
    this.connecting = true;
    try {
      const result: any = await this.provider?.connect();
      if (result.status === 200) {
        this.account = {
          address: result?.address,
          publicKey: result?.publicKey,
        };
      }
      try {
        const name = await this.provider?.network();
        const { chainId } = await this.provider?.getChainId();
        this.network.name = name as WalletAdapterNetwork;
        this.network.chainId = chainId.toString();
      } catch (error: any) {}

      this.emit('connected');
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    } finally {
      this.connecting = false;
    }
  };

  disconnect = async () => {
    try {
      await this.provider.disconnect();
      this.account = { address: '', publicKey: '' };
      this.emit('disconnect');
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  };

  signMessage = async (metaData: any) => {
    try {
      const result: any = await this.provider.signMessage(metaData);
      this.emit('signMessage');
      return result;
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  };

  signAndSubmitTransaction = async (
    payload: Types.TransactionPayload_ScriptPayload,
    options: RemoteABIBuilderConfig,
  ) => {
    const transaction = await this.provider?.generateTransaction(this.account.address, payload, {
      ...BASIC_TRANSACTION_OPTION(),
      ...options,
    });
    const result: any = await this.provider?.signAndSubmitTransaction(transaction);
    return result;
  };

  async onAccountChange(): Promise<void> {
    try {
      const handleChangeAccount = async (newAddress: string) => {
        const result: any = await this.provider?.connect();
        this.account = {
          address: result?.address,
          publicKey: result?.publicKey
        };
        this.emit('accountChange', newAddress);
      };
      await this.provider?.onAccountChange(handleChangeAccount);
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async onNetworkChange(): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: WalletAdapterNetwork) => {
        this.network =  {
          ...this.network,
          name: newNetwork
        }
        this.emit('networkChange', newNetwork);
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}

