import { EXTENSION_FOUNDATION_AUCTION_API, EXTENSION_MAKE_OFFER_API } from 'constants/check-nft.constants';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import { IMakeOfferResponse } from 'dtos/make-offer.dto';
import { ITokenDescriptor } from 'dtos/token-descriptor.dto';
import { post } from 'helpers/axios.helper';
import useSWR from 'swr';

export const useMakeOfferData = (tokenAddress: string | null, tokenId: string | null, paymentTokenAddress: string, url: string): {
  data: IMakeOfferResponse | null, loading: boolean
} => {
  const { data, error } = useSWR<IMakeOfferResponse>(
    tokenAddress && tokenId ? [EXTENSION_MAKE_OFFER_API, tokenAddress, tokenId, paymentTokenAddress, url] : null,
    () => post(EXTENSION_MAKE_OFFER_API, {
      token: {
        address: tokenAddress,
        id: tokenId,
      },
      paymentTokenAddress,
      url,
    }),
  );

  return { data: data || null, loading: Boolean(error || !data) };
};

export const useFoundationAuctionData = (auctionId: string | null,
  url: string,
  walletProvider: WALLET_PROVIDERS | null,
  handleError: () => void): {
  data: ITokenDescriptor | null, loading: boolean
} => {
  const { data, error } = useSWR<ITokenDescriptor>(
    auctionId ? [EXTENSION_FOUNDATION_AUCTION_API, auctionId] : null,
    () => post(EXTENSION_FOUNDATION_AUCTION_API, {
      auctionId: Number(auctionId),
      url,
      walletProvider,
    }),
    // in case contract didn't find the data
    { onError: handleError },
  );

  return { data: data || null, loading: Boolean(error || !data) };
};
