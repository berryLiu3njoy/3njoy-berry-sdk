export interface Wallet {
  icon: string;
  url: string;
  name: string;
  provider: any;
  isInstalled: () => boolean;
  connect: () => Promise<any>;
  disconnect: () => Promise<any>;
  signMessage: (metadata: any) => any;
  signAndSubmitTransaction: (address: string, payload: any, options: any) => Promise<any>;
}

export const formatArgusForWallet = (payload: any): any => {
  if (!Array.isArray(payload)) {
    return isNaN(payload) || typeof payload === 'boolean' ? payload : payload.toString();
  } else {
    return payload.map((pay: any) => formatArgusForWallet(pay));
  }
};

export const MAX_GAS_FEE = '100000';
export const GAS_UNIT_PRICE = '100';
console.log(GAS_UNIT_PRICE);

export const BASIC_TRANSACTION_OPTION = () => ({
  max_gas_amount: MAX_GAS_FEE,
  gas_unit_price: GAS_UNIT_PRICE,
  expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 900).toString(),
});

