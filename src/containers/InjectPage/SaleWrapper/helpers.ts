import BN from 'bignumber.js';
import { fromWeiWithoutFormat, getPercentFromValues, roundNumber } from 'helpers/big-number.helpers';
import { OrderNftsType } from 'helpers/metamask.helpers';
import { IListingInfo } from 'modules/analyze/TokenActions/Sale/ListingInfo';

interface IReturn extends IListingInfo {
  totalPrice: string | null;
}

export const getListingPriceInfo = (data: OrderNftsType, tokenDecimals: number): IReturn => {
  const totalPrice = data.buy.weiAmount ? fromWeiWithoutFormat(data.buy.weiAmount || 0, tokenDecimals) as string : null;

  const openseaFee = data.buy.openseaFeeWei ? fromWeiWithoutFormat(data.buy.openseaFeeWei || 0, tokenDecimals) as string : null;
  const openseaFeePercent = totalPrice ? getPercentFromValues(openseaFee || 0, totalPrice) : null;

  const receivedAmount = fromWeiWithoutFormat(data.buy.receiveWei || 0, tokenDecimals) as string;

  const creatorRoyalty = totalPrice && openseaFee
    ? roundNumber(new BN(totalPrice).minus(new BN(openseaFee)).minus(new BN(receivedAmount)).toString(), 4) : null;
  const creatorRoyaltyPercent = totalPrice ? getPercentFromValues(creatorRoyalty || 0, totalPrice) : null;

  const result = {
    totalPrice,
    openseaFee,
    creatorRoyalty,
    receivedAmount,
    openseaFeePercent,
    creatorRoyaltyPercent,
  };

  return result;
};
