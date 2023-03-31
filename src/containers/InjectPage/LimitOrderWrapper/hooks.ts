import { EXTENSION_LIMIT_ORDER_API } from 'constants/check-nft.constants';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import { AnalyzeContractResponse } from 'dtos/analyze-contract.dtos';
import { post } from 'helpers/axios.helper';
import useSWR from 'swr';

export const useLimitOrderData = (contractAddress: string, url: string, walletProvider: WALLET_PROVIDERS | null): {
  data: AnalyzeContractResponse | null, loading: boolean
} => {
  const { data, error } = useSWR<AnalyzeContractResponse>(
    [EXTENSION_LIMIT_ORDER_API, contractAddress, walletProvider, url],
    () => post(EXTENSION_LIMIT_ORDER_API, {
      address: contractAddress,
      walletProvider,
      url,
    }),
  );

  return { data: data || null, loading: Boolean(error || !data) };
};
