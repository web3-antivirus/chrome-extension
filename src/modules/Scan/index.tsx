import {
  FC, memo, useEffect,
  useMemo, useState,
} from 'react';
import cn from 'classnames';

import Header from 'layouts/Header';
import { getCodeExecutionEnvironment } from 'helpers/environments.helpers';
import { RisksProps } from 'types/fetch.type';
import { EXTENSION_CONTRACT_API } from 'constants/check-nft.constants';
import { Screens, useScreenContext } from 'components/ScreenProvider';
import { useUserId } from 'hooks/use-user-id';
import { useUserToken } from 'hooks/common.hooks';

import Main from './Main';
import ContractRisks from './ContractRisks';
import Settings from '../Settings';
import Feedback from '../Feedback';
import styles from './styles.module.scss';
import NoContractData from './NoContractData';

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
  const [scanScreen, setScanScreen] = useState<number>(0);
  const [analysisData, setAnalysisData] = useState({} as RisksProps);

  const userId = useUserId();
  const { isPopUp } = getCodeExecutionEnvironment();
  const { screen, handleSetScreen } = useScreenContext();
  const userToken = useUserToken();

  useEffect(() => {
    const controller = new AbortController();

    if (userId && userToken) {
      fetch(EXTENSION_CONTRACT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${userToken}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          transaction: JSON.parse(transactionParams).params[0],
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.errors?.length) {
            setScanScreen(2);
            return;
          }

          setAnalysisData(result);
          setScanScreen(1);
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            return;
          }

          setScanScreen(2);
        });
    }

    return () => controller.abort();
  }, [userId, userToken]);

  useEffect(() => {
    const [container] = document.getElementsByClassName(styles.wrapper);

    container?.addEventListener('wheel' as keyof ElementEventMap, (evt) => {
      evt.preventDefault();
      container.scrollTop += (evt as WheelEvent).deltaY;
    });
  }, [styles.wrapper]);

  const renderScreen = useMemo(() => {
    if (screen === Screens.settings) {
      return <Settings toggleSettings={() => handleSetScreen(Screens.settings)} />;
    }

    if (screen === Screens.feedback) {
      return <Feedback toggleFeedback={() => handleSetScreen(Screens.feedback)} />;
    }

    switch (scanScreen) {
      case 0:
        return <Main hideBlock={hideBlock} />;
      case 1:
        return (
          <ContractRisks
            address={analysisData?.contract?.address}
            {...analysisData}
            handleProceed={handleProceed}
            handleDecline={handleDecline}
          />
        );
      case 2:
        return <NoContractData handleSubmit={() => handleProceed(false, userId)} />;
      default:
        return null;
    }
  }, [transactionParams, screen, scanScreen, handleSetScreen, analysisData]);

  return (
    <>
      <Header
        toggleSettings={() => handleSetScreen(Screens.settings)}
        toggleFeedback={() => handleSetScreen(Screens.feedback)}
      />
      <div className={cn(styles.wrapper, { [styles.scroll]: isPopUp })}>
        {renderScreen}
      </div>
    </>
  );
};

export default memo(Scan);
