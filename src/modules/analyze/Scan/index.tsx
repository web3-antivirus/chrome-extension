import {
  FC, memo, useCallback, useEffect,
  useMemo, useState,
} from 'react';
import cn from 'classnames';

import Header from 'layouts/Header';
import { getCodeExecutionEnvironment } from 'helpers/environments.helpers';
import { EXTENSION_CONTRACT_API_V2 } from 'constants/check-nft.constants';
import { useScreenContext } from 'components/ScreenProvider';
import { useUserId } from 'hooks/use-user-id';
import { useExtensionScroll, useUserToken } from 'hooks/common.hooks';
import { AnalyzeTransactionResponse } from 'interfaces/analyze.interfaces';
import { useCurrentUrl } from 'hooks/use-current-url';

import LoaderScreen from 'components/LoaderScreen';
import { sendCustomMessage } from 'helpers/common.helpers';
import { CANCEL_CHECK_WEB3_GUARD } from 'constants/chrome-send-message.constants';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import styles from './styles.module.scss';
import NoContractData from './NoContractData';
import { getStatuses } from './helpers/data.helpers';
import {
  ANALYSIS_RANDOM_STATUSES, ANALYSIS_STATUSES, ANALYSIS_STATUSES_LABELS, STATUS_DURATION_SECONDS,
} from './constants';
import ResultProxy from './ResultProxy';

const DISABLED_RISKS = ['IP infringements', 'Financial risks', 'Community validation'];

type Props = {
  transactionParams: string;
  hideBlock: () => void;
  handleProceed: (val: boolean, userId: string) => void;
  handleDecline: (userId: string) => void;
  walletProvider: WALLET_PROVIDERS | null
};

const Scan: FC<Props> = ({
  hideBlock, transactionParams,
  handleProceed, handleDecline,
  walletProvider,
}) => {
  const url = useCurrentUrl();
  const userId = useUserId();
  const [scanScreen, setScanScreen] = useState<number>(0);
  const [analysisData, setAnalysisData] = useState<AnalyzeTransactionResponse | null>(null);
  const { isPopUp } = getCodeExecutionEnvironment();
  const { screen } = useScreenContext();
  const userToken = useUserToken();
  const [status, setStatus] = useState(ANALYSIS_STATUSES_LABELS[ANALYSIS_STATUSES.WAITING]);
  const [isLoaded, setIsLoaded] = useState(false);

  const statusText = isLoaded ? ANALYSIS_STATUSES_LABELS[ANALYSIS_STATUSES.LOADING_RESULTS] : status;

  const declineTransaction = useCallback(
    () => {
      handleDecline(userId);
    },
    [userId],
  );

  const proceedTransaction = useCallback(() => handleProceed(false, userId), [userId]);

  useEffect(() => {
    getStatuses((data) => setStatus(ANALYSIS_STATUSES_LABELS[data]));
  }, [setStatus]);

  useEffect(() => {
    const controller = new AbortController();

    if (userId && userToken) {
      fetch(EXTENSION_CONTRACT_API_V2, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${userToken}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          transaction: JSON.parse(transactionParams).params[0],
          url,
          walletProvider,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.errors?.length) {
            setScanScreen(1);
            return;
          }

          setIsLoaded(true);
          setTimeout(() => {
            setAnalysisData(result);
          }, 1000);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            return;
          }
          setScanScreen(1);
        });
    }

    return () => controller.abort();
  }, [userId, userToken, setAnalysisData]);

  const handleCancel = useCallback(
    () => {
      sendCustomMessage(CANCEL_CHECK_WEB3_GUARD);
      hideBlock();
    },
    [hideBlock],
  );

  useExtensionScroll(styles.wrapper);

  const renderScreen = useMemo(() => {
    switch (scanScreen) {
      case 0:
        return (
          <LoaderScreen
            handleCancelClick={handleCancel}
            disabledRisks={DISABLED_RISKS}
            statuses={ANALYSIS_RANDOM_STATUSES}
            isLoaded={isLoaded}
            statusDurationSeconds={STATUS_DURATION_SECONDS}
            analysisStatuses={ANALYSIS_STATUSES}
            analysisStatusesLabels={ANALYSIS_STATUSES_LABELS}
          />
        );
      case 1:
        return <NoContractData handleSubmit={() => handleProceed(false, userId)} />;
      default:
        return null;
    }
  }, [transactionParams, screen, scanScreen, statusText, handleCancel]);

  return analysisData ? (
    <ResultProxy
      handleDecline={declineTransaction}
      handleProceed={proceedTransaction}
      data={analysisData as unknown as AnalyzeTransactionResponse}
      projectAddress={JSON.parse(transactionParams).params[0]?.to}
      walletProvider={walletProvider}
    />
  ) : (
    <>
      <Header />
      <div className={cn(styles.wrapper, { [styles.scroll]: isPopUp })}>
        {renderScreen}
      </div>
    </>
  );
};

export default memo(Scan);
