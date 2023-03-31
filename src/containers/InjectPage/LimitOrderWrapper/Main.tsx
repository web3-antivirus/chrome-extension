import { FC, useMemo } from 'react';
import Layout from 'components/Layout';
import FooterButtons from 'components/FooterButtons';
import HeaderRisk from 'layouts/HeaderRisk';
import { useCurrentUrl } from 'hooks/use-current-url';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import TransactionLoader from 'components/LoaderScreen/TransactionLoader';
import LimitOrder from 'modules/analyze/LimitOrder';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { ProjectAnalysisStatus } from 'interfaces/analyze.interfaces';
import { useLimitOrderData } from './hooks';
import { getTokenData } from './helpers';

interface Props {
  contractAddress: string;
  walletProvider: WALLET_PROVIDERS | null;
  handleProceed: () => void;
  handleDecline: () => void;
}

const Main: FC<Props> = ({
  contractAddress, walletProvider, handleProceed, handleDecline,
}) => {
  const url = useCurrentUrl();

  const { data: limitOrderData, loading } = useLimitOrderData(contractAddress, url, walletProvider);

  const makeOfferData = useMemo(() => (limitOrderData ? getTokenData(
    limitOrderData.analysis, limitOrderData.audits, limitOrderData.siteAnalysis?.status as unknown as ProjectAnalysisStatus,
  ) : null), [limitOrderData]);

  return (!makeOfferData || loading) ? (
    <TransactionLoader
      isLoaded={!loading}
      handleCancelClick={handleDecline}
    />
  ) : (
    <ErrorBoundary handleError={handleProceed}>
      <Layout
        headerChild={(
          <HeaderRisk
            riskType={makeOfferData.contractData.risk}
          />
        )}
      >
        {makeOfferData && (
          <LimitOrder
            alerts={makeOfferData.alerts}
            tokenData={makeOfferData.tokenData}
            contractData={makeOfferData.contractData}
          />
        )}

        <FooterButtons
          handleDecline={handleDecline}
          handleProceed={handleProceed}
          text="What would you like to do?"
        />
      </Layout>
    </ErrorBoundary>
  );
};

export default Main;
