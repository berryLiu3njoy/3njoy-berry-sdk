import { RemoteABIBuilderConfig } from 'aptos';
import { Types } from 'aptos/dist';
import EventEmitter from 'eventemitter3';

export interface Account {
  address: string;
  publicKey: string;
}

export abstract class AbstractWallet extends EventEmitter {
  abstract icon: string;
  abstract url: string;
  abstract name: string;
  abstract account: Account | null;
  abstract connecting: boolean;
  abstract provider: any;

  get connected() {
    return !!this.account;
  }

  abstract isInstalled(): Boolean;
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;

  // abstract sendTransaction(
  //   transaction: Transaction,
  //   options?: RemoteABIBuilderConfig,
  // ): Promise<TransactionSignature>;

  // adapter singMessage
  abstract signMessage(metadata: any): any;

  abstract signAndSubmitTransaction(
    payload: Types.TransactionPayload,
    options: RemoteABIBuilderConfig,
  ): Promise<Types.TransactionSignature>;
}

