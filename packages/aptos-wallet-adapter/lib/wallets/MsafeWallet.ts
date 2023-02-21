import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';
import { MSafeWallet as wallet } from 'msafe-wallet';
import { AbstractWallet, NetworkInfo } from './AbstractWallet';
import { BASIC_TRANSACTION_OPTION, formatArgusForWallet } from './config';

const ORIGIN = 'https://app.m-safe.io';

export class MSafeWallet extends AbstractWallet {
  icon = 'https://static.souffl3.com/assets/wallet/msafe.png';
  url = wallet.getOrigin();
  name = 'MSafe Wallet';
  connecting = false;

  provider: any = wallet || {};

  isInstalled = () => true;

  account = {
    address: '',
    publicKey: '',
  };

  network: NetworkInfo = {
    name: undefined,
  };

  constructor() {
    super();

    if (wallet.inMsafeWallet()) {
      wallet.new(wallet.getOrigin(ORIGIN)).then((res: any) => {
        this.provider = res;
      });
    }
  }

  connect = async () => {
    if (!wallet.inMsafeWallet()) {
      window.open(wallet.getAppUrl(ORIGIN), '_blank');
      return;
    }

    this.provider = await wallet.new();

    this.connecting = true;
    try {
      const result: any = await this.provider?.account();
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
    const result: any = await this.provider?.signAndSubmit(
      {
        ...payload,
        arguments: formatArgusForWallet(payload.arguments),
      },
      {
        ...BASIC_TRANSACTION_OPTION(),
        ...options,
      },
    );
    return result;
  };

  async onAccountChange(): Promise<void> {}
  async onNetworkChange(): Promise<void> {}
}

