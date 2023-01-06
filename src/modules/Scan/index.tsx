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

import styles from './styles.module.scss';
import NoContractData from './NoContractData';
import Main from './Main';
import { getStatuses } from './helpers';
import { ANALYSIS_STATUSES, ANALYSIS_STATUSES_LABELS } from './constants';
import Result from './Result';

type Props = {
  transactionParams: string;
  hideBlock: () => void;
  handleProceed: (val: boolean, userId: string) => void;
  handleDecline: (userId: string) => void;
};

const Scan: FC<Props> = ({
  hideBlock, transactionParams,
  handleProceed, handleDecline,
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

  useExtensionScroll(styles.wrapper);

  const renderScreen = useMemo(() => {
    switch (scanScreen) {
      case 0:
        return (
          <Main
            hideBlock={hideBlock}
            status={statusText}
          />
        );
      case 1:
        return <NoContractData handleSubmit={() => handleProceed(false, userId)} />;
      default:
        return null;
    }
  }, [transactionParams, screen, scanScreen, statusText]);

  return analysisData ? (
    <Result
      handleDecline={declineTransaction}
      handleProceed={proceedTransaction}
      data={analysisData as unknown as AnalyzeTransactionResponse}
      projectAddress={JSON.parse(transactionParams).params[0]?.to}
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
