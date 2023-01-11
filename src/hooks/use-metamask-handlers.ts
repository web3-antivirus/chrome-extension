import {
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import {
  METAMASK_ETH_SIGN, METAMASK_PAUSE_SIGN, METAMASK_PAUSE_TRANSACTION, METAMASK_SEND_TRANSACTION,
} from 'constants/chrome-send-message.constants';
import { sendCustomMessage } from 'helpers/common.helpers';
import { checkSignDataForOrder, OrderNftsType } from 'helpers/metamask.helpers';
import { useEventListener } from 'hooks/common.hooks';
import { ALERT_ERRORS } from 'constants/alert.constants';
import { ICustomEvent } from 'interfaces/common.interfaces';
import { useAnalyzedContracts } from './use-analyzed-contracts';
import { useCurrentUrl } from './use-current-url';

interface Props {
  isTurnOnWeb3Guard?: boolean;
  userToken: string;
  setTransactionJSONData: Dispatch<SetStateAction<string>>
  setAlert: Dispatch<SetStateAction<string>>
  transactionJSONData: string;
  setSaleOrders: Dispatch<SetStateAction<OrderNftsType | null>>
  setIsShowAnalyzeBlock: Dispatch<SetStateAction<boolean>>
}

export const useMetamaskHandlers = (
  {
    isTurnOnWeb3Guard, userToken,
    setTransactionJSONData, setAlert,
    setSaleOrders,
    setIsShowAnalyzeBlock,
  }: Props,
): void => {
  const url = useCurrentUrl();
  const [analyzedContracts] = useAnalyzedContracts();

  const handleMetamaskPause = useCallback(
    (event: ICustomEvent) => {
      if (isTurnOnWeb3Guard && userToken && analyzedContracts && !analyzedContracts.includes(url)) {
        setTransactionJSONData(event.data.jsonData);
        setIsShowAnalyzeBlock(true);
      } else {
        sendCustomMessage(METAMASK_SEND_TRANSACTION);
      }
    },
    [setTransactionJSONData, isTurnOnWeb3Guard, userToken, url, analyzedContracts, setIsShowAnalyzeBlock],
  );

  const handlePauseSign = useCallback(
    (event: ICustomEvent) => {
      if (isTurnOnWeb3Guard && userToken) {
        const saleOrdersData = checkSignDataForOrder(JSON.parse(event.data.jsonData));
        if (saleOrdersData) {
          setSaleOrders(saleOrdersData);
          setTransactionJSONData(event.data.jsonData);
        } else {
          sendCustomMessage(METAMASK_SEND_TRANSACTION);
        }
      } else {
        sendCustomMessage(METAMASK_SEND_TRANSACTION);
      }
    },
    [setSaleOrders, setTransactionJSONData, isTurnOnWeb3Guard, userToken],
  );

  const handleMetamaskEthSign = useCallback(
    (event: ICustomEvent) => {
      if (isTurnOnWeb3Guard && userToken) {
        setAlert(ALERT_ERRORS.ETH_SIGN);
        setTransactionJSONData(event.data.jsonData);
      } else {
        sendCustomMessage(METAMASK_SEND_TRANSACTION);
      }
    },
    [setTransactionJSONData, isTurnOnWeb3Guard, userToken],
  );

  const messageHandler = useCallback(
    (event: ICustomEvent) => {
      if (event.data.type && (event.data.type === METAMASK_PAUSE_TRANSACTION)) {
        handleMetamaskPause(event);
      }
      if (event.data.type && (event.data.type === METAMASK_PAUSE_SIGN)) {
        handlePauseSign(event);
      }
      if (event.data.type && (event.data.type === METAMASK_ETH_SIGN)) {
        handleMetamaskEthSign(event);
      }
    },
    [handleMetamaskPause, handlePauseSign, handleMetamaskEthSign],
  );

  useEventListener({ type: 'message', listener: messageHandler as unknown as EventListener });
};
