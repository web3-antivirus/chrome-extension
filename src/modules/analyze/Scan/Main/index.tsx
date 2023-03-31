import {
  FC, memo,
} from 'react';
import cn from 'classnames';

import Button from 'components/ButtonNew';
import { BUTTON_TYPES } from 'constants/button.constants';
import Loader from 'components/Loader';
import { sendCustomMessage } from 'helpers/common.helpers';
import styles from './styles.module.scss';
import { CANCEL_CHECK_WEB3_GUARD } from '../../../../constants/chrome-send-message.constants';

type Props = {
  hideBlock: () => void
  status: string
};

const DISABLED_RISKS = ['IP infringements', 'Financial risks', 'Community validation'];

const Main: FC<Props> = ({ hideBlock, status }) => {
  const handleCancelClick = () => {
    sendCustomMessage(CANCEL_CHECK_WEB3_GUARD);
    hideBlock();
  };

  return (
    <div className={styles.wrap}>
      <h4 className={styles.title}>SCANNING FOR RISKS...</h4>
      {/* <Address className={styles.address} address={address} /> */}
      <div className={styles.risks}>
        <div className={styles.risk}>
          <div className={styles.info}>
            <div className={styles.icon}>
              <Loader />
            </div>
            <div className={styles.text}>
              Smart contract risks
            </div>
          </div>
          <div className={styles.status}>
            {status}
          </div>
        </div>
        {DISABLED_RISKS.map((risk) => (
          <div className={cn(styles.risk, styles.disabled)} key={risk}>
            <div className={styles.info}>
              <div className={styles.icon}>
                <div className={styles.loaderStub} />
              </div>
              <div className={styles.text}>
                {risk}
              </div>
            </div>
            <div className={styles.soon}>
              Soon!
            </div>
          </div>
        ))}
      </div>
      <Button className={styles.cancelBtn} onClick={handleCancelClick} styleType={BUTTON_TYPES.SECONDARY}>Cancel</Button>
    </div>
  );
};

export default memo(Main);
