import BN from 'bignumber.js';

BN.config({ EXPONENTIAL_AT: [-50, 100] });
export const fromWeiWithoutFormat = (value: number | string | null | undefined, decimals = 18): string | number | null | undefined => {
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

export const formatNumberWithMinValue = (value: string | number, decimal = 2): string => {
  const minimumValueDisplayedOnUi = new BN(1).div(10 ** decimal).toString(10);
  if (new BN(value).isLessThan(minimumValueDisplayedOnUi)) {
    return `<${minimumValueDisplayedOnUi}`;
  }

  return formatNumberWithComas(value, decimal);
};

// value2 > value1
export const getPercentFromValues = (value1: string | number, value2: string | number): number => (
  new BN(value1).div(new BN(value2)).multipliedBy(100).toNumber()
);

// value2 > value1
export const getPercentDiffFromValues = (value1: string | number, value2: string | number): number => (
  new BN(value1).minus(new BN(value2)).div(new BN(value2)).multipliedBy(100)
    .toNumber()
);

const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
  'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg', 'Uvg'];

export const MAX_VALUE_FOR_ABBREVIATE = 10 ** 9;

export const abbreviateNumber = (value: number | string, minValue = MAX_VALUE_FOR_ABBREVIATE): number | string => {
  const number = Number(value);
  if (Math.abs(number) < minValue) return number;

  const sign = number < 0 ? '-' : '';
  const absNumber = Math.abs(number);

  // eslint-disable-next-line no-bitwise
  const tier = Math.log10(absNumber) / 3 | 0;
  if (tier === 0) return `${absNumber}`;

  const postfix = suffixes[tier];
  const scale = 10 ** (tier * 3);

  const scaled = absNumber / scale;
  const floored = Math.floor(scaled);

  let str = floored.toFixed(0);
  str = (/\.0$/.test(str)) ? str.substr(0, str.length - 2) : str;

  return `${sign}${str}${postfix}`;
};

export const fromHexToString = (value: string): string => new BN(value).toString();

export const getPriceByAmount = (amount: string, unitPrice: string | number): string => new BN(amount).multipliedBy(unitPrice).toString();

export const sumNumbers = (num1: number | string, num2: number | string): string => new BN(num1).plus(new BN(num2)).toString();
