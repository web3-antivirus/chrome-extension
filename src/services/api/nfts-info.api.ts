import useSWR from 'swr';
import { EXTENSION_NFTS_API } from 'constants/check-nft.constants';
import { TokensInfoDTO } from 'dtos/token-short-info.dto';
import { post } from 'helpers/axios.helper';
import { OrderNftsTokensType } from 'helpers/metamask.helpers';

export const useNftsInfo = (tokens: OrderNftsTokensType) => {
  const url = `${EXTENSION_NFTS_API}`;
  const { data, error } = useSWR<TokensInfoDTO>([url, tokens], () => post(url, { tokens }));

  return { data, loading: !data && !error };
};
