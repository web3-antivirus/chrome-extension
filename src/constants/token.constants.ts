export enum PAYMENT_TOKENS {
  ETH = 'ETH'
}

export const TOKEN_LABELS = {
  [PAYMENT_TOKENS.ETH]: 'Ξ',
};

export enum TOKEN_TYPES {
  ERC20 = 'ERC20',
}

export const TOKEN_TYPES_LABELS = {
  [TOKEN_TYPES.ERC20]: 'ERC-20',
};

export const MAX_ERC_20_AMOUNT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
