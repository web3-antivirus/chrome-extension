import { ITokenActionData } from 'helpers/metamask.helpers';
import { AnalyzeTransactionResponse } from 'interfaces/analyze.interfaces';
import { FOUNDATION_URL } from 'constants/marketplaces-urls.constants';
import { TOKEN_ADDRESSES } from 'constants/token.constants';
import { TYPE_TOKEN_ACTION } from 'modules/analyze/TokenActions/MakeOffer/constants';

import { FOUNDATION_MAKE_OFFER_METHOD_NAME, FOUNDATION_PLACE_BID_METHOD_NAME } from '../constants';

export const getFoundationOfferData = (data: AnalyzeTransactionResponse): ITokenActionData | null => {
  if (window.location.origin === FOUNDATION_URL) {
    const traceData = data.trace.find((trace) => {
      const hasMakeOfferMethod = trace.method?.name?.includes(
        FOUNDATION_MAKE_OFFER_METHOD_NAME,
      ) || trace.method?.name?.includes(FOUNDATION_PLACE_BID_METHOD_NAME);

      if (hasMakeOfferMethod) {
        // tokenId is the second parameter
        // we skip makeOfferMethod with nullable id because it's delegate call
        const isTokenIdValid = Boolean(Number(trace.method?.params?.value?.[1]?.value));

        return isTokenIdValid;
      }

      return false;
    });
    if (traceData) {
      const { params } = traceData.method;
      const amountWei = data.traceOperations.eth;
      const isMakeOffer = traceData.method.name.includes(FOUNDATION_MAKE_OFFER_METHOD_NAME);

      // foundation uses only eth as a payment token
      const currencyAddress = TOKEN_ADDRESSES.ETH;

      const tokenActionData: ITokenActionData = {
        type: isMakeOffer
          ? TYPE_TOKEN_ACTION.MAKE_OFFER : TYPE_TOKEN_ACTION.PLACE_A_BID,
        amountWei,
        currencyAddress,
        collectionAddress: isMakeOffer ? params.value[0]?.value : null,
        tokenId: isMakeOffer ? params.value[1]?.value : null,
        auctionId: isMakeOffer ? null : params.value[0]?.value,
      };
      return tokenActionData;
    }

    return null;
  }
  return null;
};
