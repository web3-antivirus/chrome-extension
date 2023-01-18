import Accordion from 'components/Accordion';
import InfoPopup from 'components/InfoPopup';
import { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RiskData } from '../interfaces';
import { VulnerableCodeDetectorsData } from './interfaces';
import styles from './styles.module.scss';

interface Props {
  className?: string
  risks: RiskData<VulnerableCodeDetectorsData>
  isVerified?: boolean,
}

const VulnerableCodeDetectors: FC<Props> = ({ className, risks, isVerified }) => (
  <Accordion
    name="Vulnerable code detectors"
    risksCount={risks.count}
    className={className}
    disabled={!risks.count}
    isVerified={isVerified}
  >
    <div className={styles.wrap}>
      <div className={styles.detectors}>
        {risks.data.map(({ name, info }, index) => (
          <div className={styles.detector} key={uuidv4()}>
            <span className={styles.index}>#{index + 1}</span>
            <div className={styles.name}>{name}</div>
            <InfoPopup content={info} />
          </div>
        ))}
      </div>
    </div>
  </Accordion>
);

VulnerableCodeDetectors.defaultProps = {
  className: '',
  isVerified: true,
};

export default VulnerableCodeDetectors;
