import BloctoSDK from '@blocto/sdk';
import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';
import { AbstractWallet, NetworkInfo } from './AbstractWallet';

import { BASIC_TRANSACTION_OPTION } from './config';

export class BloctoWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/blocto.svg';
  url = 'https://portto.com/download';
  name = 'Blocto Wallet';
  connecting = false;

  provider: any = { id: 'xxxx' };

  isInstalled = () => true;

  account = {
    address: '',
    publicKey: '',
  };

  network: NetworkInfo = {
    name: undefined
  };

  constructor() {
    super();
  }

  connect = async () => {
    this.connecting = true;
    try {
      const sdk = new BloctoSDK({
        aptos: {
          chainId: 1,
        },
        appId: '123',
      });

      this.provider = sdk.aptos;

      this.account = await this.provider?.connect();
      this.emit('connected');
    } catch (error: any) {
      console.log(error);
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
      // this.emit('disconnect');
    } catch (error: any) {
      // this.emit('error', error);
      throw error;
    }
  };

  signMessage = async (metaData: any) => {
    try {
      const result: any = await this.provider.signMessage(metaData);
      // this.emit('signMessage');
      return result;
    } catch (error: any) {
      // this.emit('error', error);
      throw error;
    }
  };

  signAndSubmitTransaction = async (
    payload: Types.TransactionPayload_ScriptPayload,
    options: RemoteABIBuilderConfig,
  ) => {
    const result: any = await this.provider.signAndSubmitTransaction(payload, {
      ...BASIC_TRANSACTION_OPTION(),
      ...options,
    });
    return result;
  };

  async onAccountChange(): Promise<void> {};
  async onNetworkChange(): Promise<void> {};
}

