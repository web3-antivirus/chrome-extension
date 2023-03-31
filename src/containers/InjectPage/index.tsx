import {
  FC, useCallback, useEffect, useState,
} from 'react';

import {
  DECLINE_TRANSACTION_WEB3_GUARD,
  METAMASK_SEND_TRANSACTION,
} from 'constants/chrome-send-message.constants';
import { ITokenActionData, OrderNftsType } from 'helpers/metamask.helpers';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import { useNotifications } from 'hooks/use-notifications';
import { usePopupNotification } from 'hooks/use-popup-notifications';
import { NOTIFICATIONS_TEXTS } from 'constants/error.constants';
import { useUserToken } from 'hooks/common.hooks';
import { ALERT_TEXTS } from 'constants/alert.constants';
import { BROWSER } from 'constants/common.constants';

import { useMetamaskHandlers } from 'hooks/use-metamask-handlers';
import { addScriptTagInPage, sendCustomMessage } from 'helpers/common.helpers';
import { useToggle } from 'context/toggle.context';
import { ISignMessage } from 'interfaces/common.interfaces';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import NotifyBlockWrapper from './NotifyBlockWrapper';
import AnalyzeWrapper from './AnalyzeWrapper';
import SaleOrdersWrapper from './SaleOrdersWrapper';
import PopupNotification from './PopupNotification';
import Alert from './Alert';
import SignMessageWrapper from './SignMessageWrapper';
import SaleWrapper from './SaleWrapper';
import LimitOrderWrapper from './LimitOrderWrapper';
import TokenActionWrapper from './TokenActionWrapper';

const InjectPage: FC = () => {
  const userToken = useUserToken();
  const { pause } = useToggle();
  const { notification, clearNotification } = useNotifications();
  const { clearPopupNotification, popupNotification } = usePopupNotification();

  const [isShowAnalyzeBlock, setIsShowAnalyzeBlock] = useState(false);
  const [walletProvider, setWalletProvider] = useState<WALLET_PROVIDERS | null>(null);
  const [saleOrders, setSaleOrders] = useState<OrderNftsType | null>(null);
  const [tokenAction, setTokenAction] = useState<ITokenActionData | null>(null);
  const [transactionJSONData, setTransactionJSONData] = useState('');
  const [limitOrderAddress, setLimitOrderAddress] = useState('');

  const [alert, setAlert] = useState('');
  const [signMessage, setSignMessage] = useState<ISignMessage>('');
  const isTurnOnWeb3Guard = !pause.isPaused
    || !pause.pauseUntilTime
    || new Date(pause.pauseUntilTime) < new Date();

  useEffect(() => {
    if (BROWSER === 'firefox') {
      addScriptTagInPage();
    }
  }, []);

  useMetamaskHandlers({
    setAlert,
    setSaleOrders,
    setTransactionJSONData,
    transactionJSONData,
    userToken,
    isTurnOnWeb3Guard,
    setIsShowAnalyzeBlock,
    setWalletProvider,
    setSignMessage,
    setTokenAction,
    setLimitOrderAddress,
  });

  const proceedTransaction = useCallback(() => {
    sendCustomMessage(METAMASK_SEND_TRANSACTION);
  }, []);

  const declineTransaction = useCallback(() => {
    sendCustomMessage(DECLINE_TRANSACTION_WEB3_GUARD);
  }, []);

  const closeSaleOrders = useCallback(() => {
    declineTransaction();
    setTransactionJSONData('');
    setSaleOrders(null);
  }, [setTransactionJSONData, setSaleOrders]);

  const handleProceedSaleOrder = useCallback(() => {
    proceedTransaction();
    closeSaleOrders();
  }, [proceedTransaction, closeSaleOrders]);

  const closeTokenAction = useCallback(() => {
    setTransactionJSONData('');
    setTokenAction(null);
  }, [setTransactionJSONData, setTokenAction]);

  const handleProceedTokenAction = useCallback(() => {
    proceedTransaction();
    closeTokenAction();
  }, [proceedTransaction, closeTokenAction]);

  const hideAnalyze = useCallback(() => {
    setIsShowAnalyzeBlock(false);
    setTransactionJSONData('');
  }, [setTransactionJSONData, setTransactionJSONData]);

  const hideAlert = useCallback(() => {
    setAlert('');
    setTransactionJSONData('');
  }, [setAlert, setTransactionJSONData]);

  const handleProceedAlert = useCallback(() => {
    proceedTransaction();
    setAlert('');
  }, [proceedTransaction, setAlert]);

  const handleProceedSignMessage = useCallback(() => {
    proceedTransaction();
    setSignMessage('');
  }, [proceedTransaction, setSignMessage]);

  const hideSignMessage = useCallback(() => {
    declineTransaction();
    setSignMessage('');
    setTransactionJSONData('');
  }, [setSignMessage, setTransactionJSONData, declineTransaction]);

  const handleProceedLimitOrder = useCallback(() => {
    proceedTransaction();
    setLimitOrderAddress('');
  }, [proceedTransaction, setLimitOrderAddress]);

  const hideLimitOrder = useCallback(() => {
    declineTransaction();
    setLimitOrderAddress('');
    setTransactionJSONData('');
  }, [setLimitOrderAddress, setTransactionJSONData, declineTransaction]);

  if (!userToken || !isTurnOnWeb3Guard) {
    return null;
  }

  if (limitOrderAddress) {
    return (
      <LimitOrderWrapper
        contractAddress={limitOrderAddress}
        walletProvider={walletProvider}
        handleDecline={hideLimitOrder}
        handleProceed={handleProceedLimitOrder}
      />
    );
  }

  if (alert && transactionJSONData) {
    return (
      <Alert
        {...ALERT_TEXTS[alert]}
        handleClose={hideAlert}
        handleProceed={handleProceedAlert}
      />
    );
  }

  if (isShowAnalyzeBlock && transactionJSONData) {
    return (
      <>
        {isShowAnalyzeBlock && (
          <AnalyzeWrapper
            hideBlock={hideAnalyze}
            transactionParams={transactionJSONData}
            walletProvider={walletProvider}
          />
        )}
      </>
    );
  }

  if (saleOrders && !saleOrders?.isListing) {
    return (
      <SaleOrdersWrapper
        tokens={saleOrders}
        proceedTransaction={handleProceedSaleOrder}
        onClose={closeSaleOrders}
      />
    );
  }

  if (saleOrders && saleOrders?.isListing) {
    return (
      <SaleWrapper
        data={saleOrders}
        handleProceed={handleProceedSaleOrder}
        handleDecline={closeSaleOrders}
      />
    );
  }

  if (tokenAction) {
    return (
      <TokenActionWrapper
        data={tokenAction}
        handleProceed={handleProceedTokenAction}
        handleDecline={closeTokenAction}
        walletProvider={walletProvider}
      />
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

  if (notification) {
    return (
      <NotifyBlockWrapper
        {...NOTIFICATIONS_TEXTS[notification]}
        handleClose={clearNotification}
        icon={alertIcon}
      />
    );
  }

  if (popupNotification) {
    return (
      <PopupNotification
        {...NOTIFICATIONS_TEXTS[popupNotification]}
        onClose={clearPopupNotification}
      />
    );
  }

  if (signMessage) {
    return (
      <SignMessageWrapper
        handleProceed={handleProceedSignMessage}
        handleDecline={hideSignMessage}
        message={signMessage}
      />
    );
  }

  return null;
};

export default InjectPage;
