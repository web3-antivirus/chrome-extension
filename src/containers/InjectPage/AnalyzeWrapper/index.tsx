import { FC, memo } from 'react';
import cn from 'classnames';
import { createPortal } from 'react-dom';

import Scan from 'modules/Scan';
import { DECLINE_TRANSACTION_WEB3_GUARD, METAMASK_SEND_TRANSACTION } from 'constants/chrome-send-message.constants';
import { EXTENSION_ACTION_API } from 'constants/check-nft.constants';
import { useCurrentUrl } from 'hooks/use-current-url';
import { useAnalyzedContracts } from 'hooks/use-analyzed-contracts';
import styles from './styles.module.scss';

type Props = {
  transactionParams: string
  hideBlock: () => void
};

const AnalyzeWrapper: FC<Props> = ({ hideBlock, transactionParams }) => {
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

  const handleProceed = (lowRiskContract: boolean, userId: string) => {
    window.postMessage({ type: METAMASK_SEND_TRANSACTION, fromExtension: true, jsonData: transactionParams }, '*');
    handleSaveToDB({ actionType: 1, actionValue: lowRiskContract, userId });
    if (lowRiskContract) {
      setAnalyzedContract(url);
    }
    hideBlock();
  };

  const handleDecline = (userId: string) => {
    handleSaveToDB({ actionType: 1, actionValue: false, userId });
    window.postMessage({ type: DECLINE_TRANSACTION_WEB3_GUARD }, '*');
    hideBlock();
  };

  const renderContent = () => (
    <div className={styles.overlay}>
      <div className={cn(styles.wrapper, 'extension-nft-check')}>
        <Scan
          transactionParams={transactionParams}
          hideBlock={hideBlock}
          handleProceed={handleProceed}
          handleDecline={handleDecline}
        />
      </div>
    </div>
  );

  return createPortal(renderContent(), document.body);
};

export default memo(AnalyzeWrapper);
