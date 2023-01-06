import { EXTENSION_PAYMENT_TOKEN_API } from 'constants/check-nft.constants';
import { PAYMENT_TOKENS, TOKEN_LABELS } from 'constants/token.constants';
import { post } from 'helpers/axios.helper';
import { fromWei } from 'helpers/big-number.helpers';
import { useMemo } from 'react';
import useSWR from 'swr';

export declare type PaymentTokenEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  symbol: string;
  address: string;
  imageUrl: string;
  name: string;
  decimals: number;
};

export const useTokenPrice = (tokenAddress: string, weiAmount: string) => {
  const { data, error } = useSWR<PaymentTokenEntity[]>(
    [EXTENSION_PAYMENT_TOKEN_API, tokenAddress],
    () => post(EXTENSION_PAYMENT_TOKEN_API, { addresses: [tokenAddress] }),
  );

  const tokenInfo = data ? data[0] : null;
  const price = useMemo(() => (tokenInfo ? fromWei(weiAmount, tokenInfo?.decimals) : null), [tokenInfo, error, weiAmount]);

  return {
    price,
    symbol: tokenInfo?.symbol ? ((TOKEN_LABELS[(tokenInfo?.symbol as PAYMENT_TOKENS)]) || tokenInfo?.symbol) : '',
    loading: !data && !error,
  };
};
