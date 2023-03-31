import { FC, useMemo } from 'react';
import { RISK_TYPE } from 'constants/risks.constants';
import Layout from 'components/Layout';
import FooterButtons from 'components/FooterButtons';
import HeaderRisk from 'layouts/HeaderRisk';
import MakeOffer from 'modules/analyze/TokenActions/MakeOffer';
import { ITokenActionData } from 'helpers/metamask.helpers';
import { useCurrentUrl } from 'hooks/use-current-url';
import TransactionLoader from 'components/LoaderScreen/TransactionLoader';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import { useFoundationAuctionData, useMakeOfferData } from './hooks';
import { getMakeOfferData } from './helpers';

interface Props {
  data: ITokenActionData;
  handleProceed: () => void;
  handleDecline: () => void;
  walletProvider: WALLET_PROVIDERS | null
}

const Main: FC<Props> = ({
  data, handleProceed, handleDecline, walletProvider,
}) => {
  const url = useCurrentUrl();
  const { data: auctionData } = useFoundationAuctionData(data.auctionId ?? null, url, walletProvider, handleProceed);
  const tokenId = data.tokenId || auctionData?.id;
  const tokenAddress = data.collectionAddress || auctionData?.address;

  const { data: offerData, loading } = useMakeOfferData(tokenAddress ?? null, tokenId ?? null, data.currencyAddress, url);

  const makeOfferData = useMemo(() => getMakeOfferData(
    offerData, tokenId ?? null, tokenAddress ?? null, data.amountWei, data.currencyAddress,
  ), [offerData, data]);
  const totalRisk = useMemo(() => (((
    makeOfferData?.fairPricePercent && makeOfferData?.fairPricePercent >= 30)
    || (makeOfferData?.washTrading && makeOfferData?.washTrading?.washTradesPercent >= 30))
    ? RISK_TYPE.MIDDLE : RISK_TYPE.LOW), [makeOfferData]);

  return (!makeOfferData || loading) ? (
    <TransactionLoader
      isLoaded={!loading}
      handleCancelClick={handleDecline}
    />
  ) : (
    <Layout
      headerChild={(
        <HeaderRisk
          riskType={totalRisk}
        />
      )}
    >
      {makeOfferData && (
        <MakeOffer
          type={data.type}
          nft={makeOfferData.nft}
          nftPrice={makeOfferData.nftPrice}
          washTrading={makeOfferData.washTrading}
          alerts={makeOfferData.alerts}
          fairLevel={makeOfferData.fairLevel}
          fairPercent={makeOfferData.fairPricePercent}
          fairPrice={offerData?.fairPriceETH}
        />
      )}

      <FooterButtons
        handleDecline={handleDecline}
        handleProceed={handleProceed}
        text="What would you like to do?"
      />
    </Layout>
  );
};

export default Main;
