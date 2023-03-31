import { FC } from 'react';
import { MintingData } from 'modules/analyze/Scan/interfaces';
import {
  getPercentFromValues, roundNumber,
} from 'helpers/big-number.helpers';
import { isNull } from 'helpers/common.helpers';
import BigValue from 'components/BigValue';

import styles from './styles.module.scss';

const Minting: FC<MintingData> = ({ cap, total }) => {
  const hasFullData = cap && total;
  const percent = hasFullData ? roundNumber(getPercentFromValues(total, cap)) : null;

  return (
    <div className={styles.minting}>
      <span className={styles.title}>Minting</span>
      <div className={styles.values}>
        <span className={styles.countText}>
          {total ? <BigValue value={total} /> : null}
          {hasFullData ? ' of ' : ''}
          {cap ? <BigValue value={cap} /> : null} tokens
        </span>
        {!isNull(percent) && <span className={styles.percent}>{percent}%</span>}
      </div>
      {!isNull(percent) && (
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${Number(percent)}%` }} />
        </div>
      )}
    </div>
  );
};

export default Minting;
