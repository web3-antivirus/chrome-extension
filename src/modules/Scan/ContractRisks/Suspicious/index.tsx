import { FC } from 'react';

import { AnalysisDescriptor } from 'types/fetch.type';
import alertIcon from 'assets/images/icons/alert.svg';
import rightArrowIcon from 'assets/images/icons/arrow-right.svg';
import { getImageUrl } from 'helpers/image.helpers';

import styles from './styles.module.scss';

interface Props {
  data: AnalysisDescriptor
  handleOpen: () => void
}

const Suspicious: FC<Props> = ({ data, handleOpen }) => {
  const { code, scam } = data;

  const hasSuspiciousActivity = !!scam?.service1?.annotation || !!scam?.service2?.length;
  const hasHardcodedLogic = code?.service3 && 'payload' in code.service3 && !!code.service3.payload?.hardcodedAddresses.length;

  return (hasHardcodedLogic || hasSuspiciousActivity) ? (
    <div className={styles.wrap}>
      {hasHardcodedLogic
        && (
          <div className={styles.activity}>
            <div className={styles.title}>
              <img src={getImageUrl(alertIcon)} alt="" className={styles.icon} />
              Hardcoded logic
              <span className={styles.count}>
                {`(${code?.service3 && 'payload' in code.service3 ? code.service3.payload?.hardcodedAddresses.length : 0})`}
              </span>
            </div>
            <div className={styles.message}>
              A hardcoded address was found in the contract, which might be a sign of a suspicious behavior
            </div>
          </div>
        )}

      {hasSuspiciousActivity
        && (
          <div className={styles.activity}>
            <div className={styles.title}>
              <img src={getImageUrl(alertIcon)} alt="" className={styles.icon} />
              Suspicious activity
              <span className={styles.count}>{`(${scam?.service2?.length || 1})`}</span>
            </div>
          </div>
        )}

      <button className={styles.button} onClick={handleOpen}>
        More info <img src={getImageUrl(rightArrowIcon)} alt="" className={styles.arrow} />
      </button>
    </div>
  ) : null;
};

export default Suspicious;
