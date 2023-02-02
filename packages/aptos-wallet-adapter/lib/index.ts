export * from './react';

import { AdapterVuePlugin, walletStore, useWallet, useConnect } from './vue';
import {
  MartianWallet,
  FewchaWallet,
  PontemWallet,
  PetraWallet,
  OneKeyWallet,
  RiseWallet,
  OKXWallet,
  BitkeepWallet,
  HyperpayWallet,
} from './wallets';
console.log(1);

export {
  MartianWallet,
  FewchaWallet,
  PontemWallet,
  PetraWallet,
  OneKeyWallet,
  RiseWallet,
  OKXWallet,
  BitkeepWallet,
  HyperpayWallet,

  // Vue
  AdapterVuePlugin,
  walletStore,
  useWallet,
  useConnect,
};

