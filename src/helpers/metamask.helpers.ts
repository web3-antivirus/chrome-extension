import { OPEN_SEA_URL } from 'constants/marketplaces-urls.constants';
import BN from 'bignumber.js';

interface IMessage {
  params: [string, string]
  method: string
}

export type OrderNftsTokensType = {
  address: string
  id: string
}[]
export interface OrderNftsType {
  sell: OrderNftsTokensType
  buy: {
    tokenAddress: string
    weiAmount: string
    tokensCount: number | null
  }
}

enum ItemType {
  NATIVE,
  ERC20,
  ERC721,
  ERC1155,
  ERC721_WITH_CRITERIA,
  ERC1155_WITH_CRITERIA
}

// if message for seaport and not on opensea site, user can sign message for sale order
export const checkSignDataForOrder = (signMessage: IMessage): OrderNftsType | null => {
  const signParams = JSON.parse(signMessage.params[1]);
  const { message, domain } = signParams;
  if (domain.name === 'Seaport' && window.location.origin !== OPEN_SEA_URL && message?.offer?.length) {
    const sell = message?.offer?.map(
      ({ token, identifierOrCriteria, itemType }: { token: string, identifierOrCriteria: string, itemType: ItemType }) => (
        { address: token, id: identifierOrCriteria, itemType }),
    );

    const tokenAddress = message?.consideration?.[0].token;
    const isPaymentTokens = Number(message?.consideration?.[0].itemType) === ItemType.ERC20
    || Number(message?.consideration?.[0].itemType) === ItemType.NATIVE;
    const weiAmount = (message?.consideration?.length && isPaymentTokens
    ) ? message?.consideration.reduce(
        (sum: string, { endAmount }: { endAmount: string }) => (
          new BN(sum).plus(new BN(endAmount)).toString()
        ), 0,
      ) : '';
    const tokensCount = !isPaymentTokens ? message?.consideration?.length : null;
    return {
      sell,
      buy: {
        tokenAddress,
        weiAmount,
        tokensCount,
      },
    };
  }

  return null;
};
