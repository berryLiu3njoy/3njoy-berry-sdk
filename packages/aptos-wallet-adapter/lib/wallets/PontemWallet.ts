import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';

import { AbstractWallet, NetworkInfo, WalletAdapterNetwork } from './AbstractWallet';
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
      const result: any = await this.provider.connect();
      if (result) {
        this.account = {
          address: result.address,
          publicKey: result.publicKey,
        };
      }
      try {
        const { name, chainId } = await this.provider?.network();

        // the name contains chain's name
        this.network.name = name as WalletAdapterNetwork;
        this.network.chainId = chainId.toString();
        console.log(this.network)
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

  async onAccountChange(): Promise<void> {
    try {
      const handleChangeAccount = async (newAddress: string | undefined) => {
        // disconnect wallet if newAccount is undefined
        if (newAddress) {
          const newPublicKey = await this.provider?.publicKey();
          this.account = {
            publicKey: newPublicKey,
            address: newAddress,
          };
        } else {
          const result = await this.provider?.connect();
          this.account = {
            address: result.address,
            publicKey: result.publicKey,
          };
        }
        this.emit('accountChange', this.account.address);
      };
      await this.provider?.onAccountChange(handleChangeAccount);
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async onNetworkChange(): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: NetworkInfo) => {
        this.network = { ...newNetwork };
        this.emit('networkChange', newNetwork.name);
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}

