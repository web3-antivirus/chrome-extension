import {
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';

import {
  METAMASK_ETH_SIGN, METAMASK_PAUSE_SIGN, METAMASK_PAUSE_TRANSACTION, METAMASK_SEND_TRANSACTION, PERSONAL_SIGN,
} from 'constants/chrome-send-message.constants';
import { sendCustomMessage } from 'helpers/common.helpers';
import {
  checkSignDataForOrder, getPersonalSignMessage, ITokenActionData, OrderNftsType,
} from 'helpers/metamask.helpers';
import { useEventListener } from 'hooks/common.hooks';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import { ALERT_ERRORS } from 'constants/alert.constants';
import { ICustomEvent, ISignMessage } from 'interfaces/common.interfaces';
import { useAnalyzedContracts } from './use-analyzed-contracts';
import { useCurrentUrl } from './use-current-url';

interface Props {
  isTurnOnWeb3Guard?: boolean;
  userToken: string;
  setTransactionJSONData: Dispatch<SetStateAction<string>>
  setAlert: Dispatch<SetStateAction<string>>
  transactionJSONData: string;
  setSaleOrders: Dispatch<SetStateAction<OrderNftsType | null>>
  setTokenAction: Dispatch<SetStateAction<ITokenActionData | null>>
  setWalletProvider: Dispatch<SetStateAction<WALLET_PROVIDERS | null>>
  setSignMessage: Dispatch<SetStateAction<ISignMessage>>
  setIsShowAnalyzeBlock: Dispatch<SetStateAction<boolean>>
  setLimitOrderAddress: Dispatch<SetStateAction<string>>
}

export const useMetamaskHandlers = (
  {
    isTurnOnWeb3Guard, userToken,
    setTransactionJSONData, setAlert,
    setSaleOrders,
    setIsShowAnalyzeBlock,
    setWalletProvider,
    setSignMessage,
    setTokenAction,
    setLimitOrderAddress,
  }: Props,
): void => {
  const url = useCurrentUrl();
  const [analyzedContracts] = useAnalyzedContracts();

  const handleMetamaskPause = useCallback(
    (event: ICustomEvent) => {
      if (isTurnOnWeb3Guard && userToken && analyzedContracts && !analyzedContracts.includes(url)) {
        setTransactionJSONData(event.data.jsonData);
        setWalletProvider(event.data.walletProvider ?? null);
        setIsShowAnalyzeBlock(true);
      } else {
        sendCustomMessage(METAMASK_SEND_TRANSACTION);
      }
    },
    [setTransactionJSONData, isTurnOnWeb3Guard, userToken, url, analyzedContracts, setIsShowAnalyzeBlock, setWalletProvider],
  );

  const handlePauseSign = useCallback(
    (event: ICustomEvent) => {
      if (isTurnOnWeb3Guard && userToken) {
        const {
          saleOrdersData, message, tokenActionData, limitOrderAddress,
        } = checkSignDataForOrder(JSON.parse(event.data.jsonData));
        if (saleOrdersData) {
          setSaleOrders(saleOrdersData);
        } else if (tokenActionData) {
          setTokenAction(tokenActionData);
        } else if (limitOrderAddress) {
          setLimitOrderAddress(limitOrderAddress);
        } else {
          setSignMessage(message);
        }
        setTransactionJSONData(event.data.jsonData);
      } else {
        sendCustomMessage(METAMASK_SEND_TRANSACTION);
      }
    },
    [setSaleOrders, setTransactionJSONData, isTurnOnWeb3Guard, userToken, setTokenAction, setLimitOrderAddress],
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

  const handlePersonalSign = useCallback(
    (event: ICustomEvent) => {
      if (isTurnOnWeb3Guard && userToken) {
        const message = getPersonalSignMessage(JSON.parse(event.data.jsonData));
        setSignMessage(message);
      } else {
        sendCustomMessage(METAMASK_SEND_TRANSACTION);
      }
    },
    [setSignMessage, isTurnOnWeb3Guard, userToken],
  );

  const messageHandler = useCallback(
    (event: ICustomEvent) => {
      try {
        if (event.data.type && (event.data.type === METAMASK_PAUSE_TRANSACTION)) {
          handleMetamaskPause(event);
        }
        if (event.data.type && (event.data.type === METAMASK_PAUSE_SIGN)) {
          handlePauseSign(event);
        }
        if (event.data.type && (event.data.type === METAMASK_ETH_SIGN)) {
          handleMetamaskEthSign(event);
        }
        if (event.data.type && (event.data.type === PERSONAL_SIGN)) {
          handlePersonalSign(event);
        }
      } catch (error) {
        sendCustomMessage(METAMASK_SEND_TRANSACTION);
      }
    },
    [handleMetamaskPause, handlePauseSign, handleMetamaskEthSign, handlePersonalSign],
  );

  useEventListener({ type: 'message', listener: messageHandler as unknown as EventListener });
};
