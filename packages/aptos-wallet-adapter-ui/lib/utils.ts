export const SHORT_ADDRESS = (address: string) => {
  return address ? address.replace(/(^\S{4})(\S*)(\S{4})$/, '$1...$3') : '';
};

