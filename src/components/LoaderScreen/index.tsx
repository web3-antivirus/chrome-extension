import {
  FC, useEffect, useState,
} from 'react';
import cn from 'classnames';

import Button from 'components/ButtonNew';
import { BUTTON_TYPES } from 'constants/button.constants';
import Loader from 'components/Loader';
import styles from './styles.module.scss';
import { getStatuses } from './helpers';

export interface ILoaderScreenProps {
  handleCancelClick: () => void
  disabledRisks?: string[] | null;
  title?: string
  statuses: string[];
  statusDurationSeconds: Record<string, { from: number, to: number}>
  analysisStatuses: Record<string, string>
  analysisStatusesLabels: Record<string, string>
  isLoaded: boolean;
}

const LoaderScreen: FC<ILoaderScreenProps> = ({
  handleCancelClick, disabledRisks, title, analysisStatuses, analysisStatusesLabels, statuses, statusDurationSeconds, isLoaded,
}) => {
  const [status, setStatus] = useState(analysisStatusesLabels[analysisStatuses.WAITING]);

  const statusText = isLoaded ? analysisStatusesLabels[analysisStatuses.LOADING_RESULTS] : status;

  useEffect(() => {
    getStatuses((data) => setStatus(analysisStatusesLabels[data]), statuses, statusDurationSeconds);
  }, [setStatus]);

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
              {title}
            </div>
          </div>
          <div className={styles.status}>
            {statusText}
          </div>
        </div>
        {disabledRisks?.map((risk) => (
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

LoaderScreen.defaultProps = {
  disabledRisks: undefined,
  title: 'Smart contract risks',
};

export default LoaderScreen;
