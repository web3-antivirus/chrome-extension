import {
  FC, useEffect, useState,
} from 'react';

import {
  CHANGE_IS_TURN_ON_WEB3_GUARD, METAMASK_SEND_TRANSACTION,
} from 'constants/chrome-send-message.constants';
import { useTurnOnWeb3Guard } from 'hooks/use-turn-on-web3-guard';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import { useNotifications } from 'hooks/use-notifications';
import { usePopupNotification } from 'hooks/use-popup-notifications';
import { NOTIFICATIONS_TEXTS } from 'constants/error.constants';
import { useUserToken } from 'hooks/common.hooks';
import { ALERT_TEXTS } from 'constants/alert.constants';

import { useMetamaskHandlers } from 'hooks/use-metamask-handlers';
import NotifyBlockWrapper from './NotifyBlockWrapper';
import AnalyzeWrapper from './AnalyzeWrapper';
import PopupNotification from './PopupNotification';
import Alert from './Alert';

const InjectPage: FC = () => {
  const userToken = useUserToken();
  const { isTurnOnWeb3Guard } = useTurnOnWeb3Guard();
  const { notification, clearNotification } = useNotifications();
  const { clearPopupNotification, popupNotification } = usePopupNotification();

  const [isShowAnalyzeBlock, setIsShowAnalyzeBlock] = useState(false);
  const [transactionJSONData, setTransactionJSONData] = useState('');
  const [alert, setAlert] = useState('');

  useMetamaskHandlers({
    setAlert, setTransactionJSONData, transactionJSONData, userToken, isTurnOnWeb3Guard, setIsShowAnalyzeBlock,
  });

  const proceedTransaction = () => {
    window.postMessage({ type: METAMASK_SEND_TRANSACTION, fromExtension: true, jsonData: transactionJSONData }, '*');
  };

  const hideAnalyze = () => {
    setIsShowAnalyzeBlock(false);
    setTransactionJSONData('');
  };

  const hideAlert = () => {
    setAlert('');
    setTransactionJSONData('');
  };

  const handleProceedAlert = () => {
    proceedTransaction();
    setAlert('');
  };

  useEffect(() => {
    if (isTurnOnWeb3Guard !== undefined) {
      window.postMessage({ type: CHANGE_IS_TURN_ON_WEB3_GUARD, isTurnOnWeb3Guard }, '*');
    }
  }, [isTurnOnWeb3Guard]);

  if (!userToken || !isTurnOnWeb3Guard) {
    return null;
  }

  if (alert && transactionJSONData) {
    return <Alert {...ALERT_TEXTS[alert]} handleClose={hideAlert} handleProceed={handleProceedAlert} />;
  }

  if (isShowAnalyzeBlock && transactionJSONData) {
    return (
      <>
        {isShowAnalyzeBlock && <AnalyzeWrapper hideBlock={hideAnalyze} transactionParams={transactionJSONData} />}
      </>
    );
  }

  // notification about checked url
  // if (urlCheckData?.status === PROJECT_ANALYSIS_STATUS.VALIDATED && isTurnOnWeb3Guard) {
  //   return (
  //     <NotifyBlockWrapper
  //       title={`${(urlCheckData as ValidatedAnalysisDescriptorDTO)?.payload?.name} -
  //       ${(urlCheckData as ValidatedAnalysisDescriptorDTO)?.payload?.category} is verified`}
  //     />
  //   );
  // }

  if (isTurnOnWeb3Guard && notification) {
    return (
      <NotifyBlockWrapper
        {...NOTIFICATIONS_TEXTS[notification]}
        handleClose={clearNotification}
        icon={alertIcon}
      />
    );
  }

  if (isTurnOnWeb3Guard && popupNotification) {
    return (
      <PopupNotification
        {...NOTIFICATIONS_TEXTS[popupNotification]}
        onClose={clearPopupNotification}
      />
    );
  }

  return null;
};

export default InjectPage;
