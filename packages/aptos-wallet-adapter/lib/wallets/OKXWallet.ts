import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';

import { AbstractWallet } from './AbstractWallet';
import { BASIC_TRANSACTION_OPTION, formatArgusForWallet } from './config';

export class OKXWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/okx.svg';
  url = 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge';
  name = 'OKX Wallet';
  connecting = false;

  provider = window.okexchain?.aptos || null;

  isInstalled = () => !!window.okexchain?.aptos;

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
      this.account = {
        address: result?.address,
        publicKey: result?.publicKey,
      };
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

