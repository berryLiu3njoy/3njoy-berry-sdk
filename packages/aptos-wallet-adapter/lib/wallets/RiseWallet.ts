import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';

import { AbstractWallet } from './AbstractWallet';
import { BASIC_TRANSACTION_OPTION, formatArgusForWallet } from './config';

export class RiseWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/rise.png';
  url = 'https://chrome.google.com/webstore/detail/hbbgbephgojikajhfbomhlmmollphcad';
  name = 'Rise Wallet';
  connecting = false;

  provider = window.rise || null;

  isInstalled = () => !!window.rise;

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
      const connected: any = await this.provider.connect();
      if (connected) {
        const result: any = this.provider.account();
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
    return await this.provider?.signAndSubmitTransaction(
      {
        ...payload,
        arguments: formatArgusForWallet(payload.arguments),
      },
      {
        ...BASIC_TRANSACTION_OPTION(),
        ...options,
      },
    );
  };
}

