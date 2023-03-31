import { FC, memo, useCallback } from 'react';
import cn from 'classnames';

import Scan from 'modules/analyze/Scan';
import { DECLINE_TRANSACTION_WEB3_GUARD, METAMASK_SEND_TRANSACTION } from 'constants/chrome-send-message.constants';
import { EXTENSION_ACTION_API } from 'constants/check-nft.constants';
import { useCurrentUrl } from 'hooks/use-current-url';
import { getShadowRoot, sendCustomMessage } from 'helpers/common.helpers';
import { useAnalyzedContracts } from 'hooks/use-analyzed-contracts';
import { createPortal } from 'react-dom';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { WALLET_PROVIDERS } from 'constants/wallet.constants';
import styles from './styles.module.scss';

type Props = {
  transactionParams: string
  hideBlock: () => void
  walletProvider: WALLET_PROVIDERS | null
};

const AnalyzeWrapper: FC<Props> = ({ hideBlock, transactionParams, walletProvider }) => {
  const [, setAnalyzedContract] = useAnalyzedContracts();
  const url = useCurrentUrl();

  const handleSaveToDB = ({ actionType, actionValue, userId }: { actionType: number, actionValue: boolean, userId: string }) => {
    // eslint-disable-next-line no-void
    void fetch(EXTENSION_ACTION_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        userId,
        actionEntity: JSON.parse(transactionParams).params[0].to,
        actionType,
        actionValue,
        websiteURL: url,
      }),
    });
  };

  const handleConfirmTransaction = useCallback(() => {
    sendCustomMessage(METAMASK_SEND_TRANSACTION);
    hideBlock();
  }, [hideBlock]);

  const handleProceed = (lowRiskContract: boolean, userId: string) => {
    sendCustomMessage(METAMASK_SEND_TRANSACTION);
    handleSaveToDB({ actionType: 1, actionValue: true, userId });
    if (lowRiskContract) {
      setAnalyzedContract(url);
    }
    hideBlock();
  };

  const handleDecline = (userId: string) => {
    handleSaveToDB({ actionType: 1, actionValue: false, userId });
    sendCustomMessage(DECLINE_TRANSACTION_WEB3_GUARD);
    hideBlock();
  };

  const renderContent = () => (
    <ErrorBoundary handleError={handleConfirmTransaction}>
      <div className={styles.overlay}>
        <div className={cn(styles.wrapper, 'web3-antivirus')}>
          <Scan
            transactionParams={transactionParams}
            hideBlock={hideBlock}
            handleProceed={handleProceed}
            handleDecline={handleDecline}
            walletProvider={walletProvider}
          />
        </div>
      </div>
    </ErrorBoundary>
  );

  const root = getShadowRoot();

  return createPortal(renderContent(), root || document.body);
};

export default memo(AnalyzeWrapper);
