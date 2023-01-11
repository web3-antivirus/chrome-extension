export const METAMASK_METHODS = {
  sendTransaction: 'eth_sendTransaction',
  signData: 'eth_signTypedData_v4',
  ethSign: 'eth_sign',
};

export const INTERCEPT_METHODS = new Set([...Object.values(METAMASK_METHODS)]);
