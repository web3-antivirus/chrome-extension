import _ from 'lodash';

export const isValidEthereumAddress = (address: string): boolean => {
  if (!/^(0x)?[0-9a-f]{40}$/.test(address)) {
    // Check if it has the basic requirements of an address
    return false;
  } if (/^(0x)?[0-9a-f]{40}$/.test(address)) {
    // If it's all lowercase hex characters, return true
    return true;
  }
  return false;
};

export const removeLeadingZerosFromString = (data: string): string => data.replace(/^0+/, '');

export const padHexNumber = (hex: string, valueSize = 40, excludeOx = false, removeOx = false): string => {
  const valuePart = removeOx ? (hex ?? '').slice(2) : hex;
  const formatedValuePart = _(valuePart).toLower().padEnd(valueSize, '0');
  return excludeOx === true ? formatedValuePart : `0x${formatedValuePart}`;
};
