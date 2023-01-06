import Accordion from 'components/Accordion';
import { FC } from 'react';
import { format } from 'date-fns';
import { SuspiciousActivityData } from './interfaces';
import styles from './styles.module.scss';
import { RiskData } from '../interfaces';

interface Props {
  className?: string
  risks: RiskData<SuspiciousActivityData>
}

const SuspiciousActivity: FC<Props> = ({ className, risks }) => (
  <Accordion name="Suspicious activity" risksCount={risks.count} className={className} disabled={!risks.count}>
    <div className={styles.wrap}>
      {risks.data.map(({ date, text, count }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={styles.activity} key={`${date}-${index}`}>
          <div className={styles.date}>{format(new Date(date), 'MMM dd, yyyy')}</div>
          <div className={styles.text}>{text}<span className={styles.count}>({count})</span></div>
        </div>
      ))}
    </div>
  </Accordion>
);

SuspiciousActivity.defaultProps = {
  className: '',
};

export default SuspiciousActivity;
