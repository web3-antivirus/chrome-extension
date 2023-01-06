import BN from 'bignumber.js';

BN.config({ EXPONENTIAL_AT: [-50, 100] });
export const fromWeiWithoutFormat = (value: number | string | null | undefined, decimals: number): string | number | null | undefined => {
  if (value !== undefined && value !== null) {
    return new BN(value).dividedBy(10 ** decimals).toString(10);
  }

  return value;
};

export const fromWei = (value: number | string, decimals = 18, round = 4): string => {
  const result = fromWeiWithoutFormat(value, decimals);

  if (result && decimals > 0) {
    const minimumValueDisplayedOnUi = new BN(1).div(10 ** round).toString(10);
    if (new BN(result).isLessThan(minimumValueDisplayedOnUi)) {
      return `<${minimumValueDisplayedOnUi}`;
    }
  }

  if (result !== undefined && result !== null) {
    return new BN(result).decimalPlaces(round, BN.ROUND_FLOOR).toString();
  }

  return '';
};

export const roundNumber = (value: string | number, decimal = 1): string => new BN(value).decimalPlaces(decimal).toString();

export const formatNumberWithComas = (value: string | number, decimals = 2): string => (
  Number(roundNumber(value, decimals)).toLocaleString()
);
