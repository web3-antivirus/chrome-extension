import { FC, useMemo } from 'react';
import TransactionLoader from 'components/LoaderScreen/TransactionLoader';
import { useUrlAnalyzeAlert } from 'hooks/use-url-analyze';
import { INftDetails } from 'modules/analyze/Scan/interfaces';
import { OrderNftsType } from 'helpers/metamask.helpers';
import { useNftsInfoWithCollections } from 'services/api/nfts-info.api';
import { NO_COLLECTION_LABEL } from 'modules/analyze/Scan/constants';
import { getListingPriceInfo } from 'containers/InjectPage/SaleWrapper/helpers';
import { useTokenPrice } from 'services/api/token-price.api';
import { tokenService } from 'services/token/token.service';
import { ImageSize } from 'services/token/shared/enums';
import Main from './Main';

interface Props {
  handleProceed: () => void;
  handleDecline: () => void;
  data: OrderNftsType
}

const Sale: FC<Props> = ({
  handleDecline, handleProceed, data,
}) => {

  const { data: nftsData } = useNftsInfoWithCollections(data.sell);
  const nfts: INftDetails[] | null = useMemo(
    () => (nftsData ? data.sell.map((token) => {
      const nftData = nftsData.tokens.find((nft) => nft.externalId === token.id && nft.contractAddress === token.address.toLowerCase());
      const collectionData = nftsData.collections?.length === 1
        ? nftsData.collections?.find((collection) => collection.id === nftData?.collectionId) : null;

      const imageSrc = nftData ? tokenService.getPreviewURL(
        {
          previewURL: nftData.url,
          croppedPreviewURL: nftData.croppedPreviewURL,
          animatedPreviewURL: nftData.animationUrl,
          size: ImageSize.Size560,
          defaultPreviewURL: nftData.url,
        },
      ) : undefined;
      return ({
        ...(nftData || {}),
        imageSrc,
        address: token.address,
        id: token.id,
        collectionName: collectionData === null ? '' : (collectionData?.name || NO_COLLECTION_LABEL),
      });
    }) : null), [nftsData],
  );

  const siteAlert = useUrlAnalyzeAlert();
  const { decimals, symbol } = useTokenPrice(data.buy.tokenAddress, data.buy.weiAmount);

  const listingInfo = useMemo(() => (data && decimals ? getListingPriceInfo(data, decimals) : null), [data, decimals]);
  const isLoading = useMemo(() => !listingInfo || !siteAlert || !nfts, [listingInfo, siteAlert, nfts]);

  return isLoading ? (
    <TransactionLoader
      isLoaded={!isLoading}
      handleCancelClick={handleDecline}
    />
  ) : (
    <Main
      handleProceed={handleProceed}
      handleDecline={handleDecline}
      nfts={nfts!}
      siteAlert={siteAlert!}
      symbol={symbol}
      listingInfo={listingInfo!}
    />
  );
};

export default Sale;
