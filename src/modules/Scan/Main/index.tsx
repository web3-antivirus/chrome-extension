import {
  FC, memo,
} from 'react';
import cn from 'classnames';

import {
  CommunityValidationIcon, FinancialRisksIcon,
  IpInfringementIcon, SmartContractRisksIcon,
} from 'constants/icons.constants';
import Button from 'components/Button';

import styles from './styles.module.scss';
import { CANCEL_CHECK_WEB3_GUARD } from '../../../constants/chrome-send-message.constants';

type Props = {
  hideBlock: () => void
};

const Main: FC<Props> = ({ hideBlock }) => {
  const handleCancelClick = () => {
    window.postMessage({ type: CANCEL_CHECK_WEB3_GUARD }, '*');
    hideBlock();
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Scanning contract</p>
      <div className={styles.container}>
        <div className={styles.itemWrapper}>
          <div className={styles.item}>
            <div className={styles.loader} />
            <SmartContractRisksIcon classNames={styles.icon} />
            Smart contract risks
          </div>
        </div>
        <div className={styles.itemWrapper}>
          <span className={styles.soon}>Coming soon</span>
          <div className={cn(styles.item, styles.inactive)}>
            <IpInfringementIcon />
            IP infringements
          </div>
        </div>
        <div className={styles.itemWrapper}>
          <span className={styles.soon}>Coming soon</span>
          <div className={cn(styles.item, styles.inactive)}>
            <FinancialRisksIcon />
            Financial risks
          </div>
        </div>
        <div className={styles.itemWrapper}>
          <span className={styles.soon}>Coming soon</span>
          <div className={cn(styles.item, styles.inactive)}>
            <CommunityValidationIcon />
            Community validation
          </div>
        </div>
      </div>

      <Button
        className={styles.buttonWrapper}
        buttonClassName={styles.button}
        styleType="gray"
        onClick={handleCancelClick}
      >
        Cancel
      </Button>
    </div>
  );
};

export default memo(Main);
