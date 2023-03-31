import { IWashTradingData } from 'components/SwapInfo/interfaces';
import { RISK_TYPE } from 'constants/risks.constants';
import { IMakeOfferResponse } from 'dtos/make-offer.dto';
import {
  fromWeiWithoutFormat, getPercentDiffFromValues, getPercentFromValues, getPriceByAmount, roundNumber,
} from 'helpers/big-number.helpers';
import { ProjectAnalysisStatus } from 'interfaces/analyze.interfaces';
import { NO_COLLECTION_LABEL } from 'modules/analyze/Scan/constants';
import { getWebsiteAlertByStatus } from 'modules/analyze/Scan/helpers/common.helpers';
import { INftDetails, INftPrice } from 'modules/analyze/Scan/interfaces';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';
import { FAIR_LEVEL } from 'modules/analyze/TokenActions/MakeOffer/constants';
import { ImageSize } from 'services/token/shared/enums';
import { tokenService } from 'services/token/token.service';

const getNftData = (data: IMakeOfferResponse, tokenId: string, collectionAddress: string): INftDetails => {
  const nftData = data.token || {};
  const imageSrc = tokenService.getPreviewURL(
    {
      previewURL: nftData.url,
      croppedPreviewURL: nftData.croppedPreviewURL,
      animatedPreviewURL: nftData.animationUrl,
      size: ImageSize.Size560,
    },
    true,
  );

  return ({
    imageSrc,
    name: nftData.name,
    collectionName: data.collection?.name || NO_COLLECTION_LABEL,
    id: tokenId,
    address: collectionAddress,
  });
};

const getNftPrice = (data: IMakeOfferResponse, amountWei: string, currencyAddress: string): INftPrice => {
  const contractData = data.contracts.find((contract) => contract.address === currencyAddress);
  const price = fromWeiWithoutFormat(amountWei, contractData?.decimals || 18) as string;

  return ({
    symbol: contractData?.symbol || '',
    cryptoPrice: price,
    usdPrice: data.paymentTokenPriceUSD ? getPriceByAmount(price, data.paymentTokenPriceUSD) : null,
  });
};

const getWashTrading = (data: IMakeOfferResponse) => (data?.washTradingStatistic?.numOfWashTradings ? {
  totalTrades: data?.washTradingStatistic.numOfSales,
  washTrades: data?.washTradingStatistic.numOfWashTradings,
  washTradesPercent: getPercentFromValues(
    data?.washTradingStatistic.numOfWashTradings, data?.washTradingStatistic.numOfSales,
  ),
} : undefined);

const getAlerts = (data: IMakeOfferResponse,
  fairLevel: FAIR_LEVEL | null,
  fairPricePercent: number | null,
  washTradesPercent: number | null): IHighlightAlert[] => {
  const urlAlert = getWebsiteAlertByStatus(data.siteAnalysis.status as unknown as ProjectAnalysisStatus);

  const collectionAlert = data.collection ? {
    openseaVerifiedInfo: {
      nftName: data.collection?.name || NO_COLLECTION_LABEL,
      isVerified: data.collection?.isVerified,
    },
    risk: data.collection?.isVerified ? RISK_TYPE.LOW : RISK_TYPE.CRITICAL,
  } : null;

  const fairPriceAlert = fairPricePercent ? {
    fairPricePercent,
    risk: fairPricePercent >= 30 ? RISK_TYPE.CRITICAL : RISK_TYPE.LOW,
  } : null;

  const washTradesAlert = (fairLevel && washTradesPercent) ? {
    washTradesPercent,
    risk: washTradesPercent >= 30 ? RISK_TYPE.CRITICAL : RISK_TYPE.LOW,
  } : null;

  return [
    ...(collectionAlert ? [collectionAlert] : []),
    urlAlert,
    ...(fairPriceAlert ? [fairPriceAlert] : []),
    ...(washTradesAlert ? [washTradesAlert] : []),
  ];
};

const getFairPricePercent = (fairPriceETH: string, nftPrice: string): number | null => (fairPriceETH
  ? Number(roundNumber(getPercentDiffFromValues(nftPrice, fairPriceETH), 2)) : null);

const getFairLevelByPricePercentDiff = (percent: number | null): FAIR_LEVEL | null => {
  if (percent === null) return null;
  if (percent >= 30) return FAIR_LEVEL.LOW;
  if (percent >= 15 && percent < 30) return FAIR_LEVEL.MEDIUM;
  return FAIR_LEVEL.HIGH;
};

export const getMakeOfferData = (data: IMakeOfferResponse | null,
  tokenId: string | null,
  collectionAddress: string | null,
  amountWei: string,
  currencyAddress: string): {
  nft: INftDetails;
  nftPrice: INftPrice;
  washTrading?: IWashTradingData
  fairPricePercent: number | null;
  fairLevel: FAIR_LEVEL | null;
  alerts: IHighlightAlert[]
} | null => {
  if (data && tokenId && collectionAddress) {
    const nftPrice = getNftPrice(data, amountWei, currencyAddress);
    const fairPricePercent = getFairPricePercent(data.fairPriceETH, nftPrice.cryptoPrice);
    const fairLevel = getFairLevelByPricePercentDiff(fairPricePercent);
    const washTrading = getWashTrading(data);
    const alerts = getAlerts(data, fairLevel, fairPricePercent, washTrading?.washTradesPercent || null);
    return ({
      nft: getNftData(data, tokenId, collectionAddress),
      nftPrice,
      washTrading,
      fairPricePercent,
      fairLevel,
      alerts,
    });
  }

  return null;
};
