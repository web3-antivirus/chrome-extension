import BN from 'bignumber.js';

export const fromWeiWithoutFormat = (value: number | string | null | undefined, decimals: number): string | number | null | undefined => {
  if (value !== undefined && value !== null) {
    return new BN(value).dividedBy(10 ** decimals).toString(10);
  }

  return value;
};

export const fromWei = (value: number | string, decimals: number): string => {
  const result = fromWeiWithoutFormat(value, decimals);

  if (result !== undefined && result !== null) {
    return new BN(result).decimalPlaces(decimals, BN.ROUND_FLOOR).toString();
  }

  return '';
};

export const roundNumber = (value: string | number, decimal = 1): string => new BN(value).decimalPlaces(decimal).toString();
