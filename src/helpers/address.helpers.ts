export const separateAddress = (address: string, number = 3): string => (
  address ? `0x${address.substring(2, 2 + number)}...${address.substring(address.length - number)}` : address
);

export const formatAddress = (address: string, number = 4): string => (address ? (
  `${address.substring(0, number)}...${address.substring(address.length - number)}`
) : address);
