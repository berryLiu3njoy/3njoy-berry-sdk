import Web3 from '@fewcha/web3';
import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';
import { AbstractWallet, NetworkInfo } from './AbstractWallet';

import { BASIC_TRANSACTION_OPTION } from './config';
const web3 = new Web3();

export class FewchaWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/fewcha.png';
  url = 'https://fewcha.app/';
  name = 'Fewcha Wallet';
  connecting = false;

  provider: any = web3.action || window.fewcha || null;

  isInstalled = () => !!this.provider;

  account = {
    address: '',
    publicKey: '',
  };

  network: NetworkInfo = {
    name: undefined
  };

  constructor() {
    super();
    window.addEventListener('fewcha#initialized', () => {
      this.provider = web3.action;
    });
  }

  connect = async () => {
    this.connecting = true;
    try {
      const provider = this.provider || window.fewcha;
      const result: any = await provider.connect();
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
      const provider = this.provider || window.fewcha;
      await provider.disconnect();
      this.account = { address: '', publicKey: '' };
      this.emit('disconnect');
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  };

  signMessage = async (metaData: any) => {
    try {
      const provider = this.provider || window.fewcha;
      const result: any = await provider.signMessage(metaData);
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
    const provider = this.provider || window.fewcha;
    const transaction = await provider.generateTransaction(payload, {
      ...BASIC_TRANSACTION_OPTION(),
      ...options,
    });
    const result: any = await provider.signAndSubmitTransaction(transaction.data);

    if (result.status !== 200) {
      return Promise.reject({
        ...result,
        message: result.status == 401 ? 'User reject the request' : result.message,
      });
    } else {
      return result;
    }
  };

  async onAccountChange(): Promise<void> {};
  async onNetworkChange(): Promise<void> {};
}

