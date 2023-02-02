import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';

import { AbstractWallet } from './AbstractWallet';
import { BASIC_TRANSACTION_OPTION } from './config';

export class FewchaWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/fewcha.png';
  url = 'https://fewcha.app/';
  name = 'Fewcha Wallet';
  connecting = false;

  provider = window.fewcha || null;

  isInstalled = () => !!window.fewcha;

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
      const result: any = await this.provider?.connect();
      console.log(result);
      if (result.status === 200) {
        this.account = result.data;
      }
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
      return result.data;
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  };

  signAndSubmitTransaction = async (
    payload: Types.TransactionPayload_ScriptPayload,
    options: RemoteABIBuilderConfig,
  ) => {
    const txnRequest = await this.provider.generateTransaction(payload, {
      ...BASIC_TRANSACTION_OPTION(),
      ...options,
    });
    const signedTx = await this.provider.signTransaction(txnRequest.data);
    const result: any = await this.provider.submitTransaction(signedTx.data);
    return result;
  };
}

