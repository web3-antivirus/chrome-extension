import { WALLET_PROVIDERS } from '../constants/wallet.constants';

export const getWalletProvider = (provider: any): WALLET_PROVIDERS | null => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const globalProvider = provider || window.ethereum;
  if (globalProvider) {
    const PROVIDERS = {
      [WALLET_PROVIDERS.METAMASK]: Boolean(globalProvider.isMetaMask),
      [WALLET_PROVIDERS.COINBASE]: Boolean(globalProvider.isCoinbaseWallet),
      [WALLET_PROVIDERS.EXODUS]: Boolean(globalProvider.isExodus),
      [WALLET_PROVIDERS.TRUST_WALLET]: Boolean(globalProvider.isTrust),
      [WALLET_PROVIDERS.BITKEEP]: Boolean(globalProvider.isBitKeep),
      [WALLET_PROVIDERS.MATH_WALLET]: Boolean(globalProvider.isMathWallet),
    };

    const walletType = (Object.values(WALLET_PROVIDERS) as WALLET_PROVIDERS[]).find(
      (key) => PROVIDERS[key],
    );

    return walletType ?? null;
  }
  return null;
};
