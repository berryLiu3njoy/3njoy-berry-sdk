import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';

import { AbstractWallet } from './AbstractWallet';
import { BASIC_TRANSACTION_OPTION, formatArgusForWallet } from './config';

export class PontemWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/pontem.png';
  url =
    'https://chrome.google.com/webstore/detail/pontem-aptos-wallet/phkbamefinggmakgklpkljjmgibohnba/related';
  name = 'Pontem Wallet';
  connecting = false;

  provider = window.pontem || null;

  isInstalled = () => !!window.pontem;

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
      if (result) {
        this.account = {
          address: result.address,
          publicKey: result.publicKey,
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
      return result.result;
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  };

  signAndSubmitTransaction = async (
    payload: Types.TransactionPayload_ScriptPayload,
    options: RemoteABIBuilderConfig,
  ) => {
    return await this.provider?.signAndSubmit(
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

