import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';

import { AbstractWallet } from './AbstractWallet';
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

  constructor() {
    super();
  }

  connect = async () => {
    this.connecting = true;
    try {
      const result: any = await this.provider.connect();
      if (result.status === 200) {
        this.account = {
          address: result?.address,
          publicKey: result?.publicKey,
        };
      }
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
}

