import { FC } from 'react';
import cn from 'classnames';

import TechnicalRisks from './TechnicalRisks';
import styles from './styles.module.scss';
import { RisksData } from './interfaces';
import VulnerableCodeDetectors from './VulnerableCodeDetectors';
import HardcodedLogic from './HardcodedLogic';

type Props = RisksData & {
  className?: string
  isVerified?: boolean,
}

const Risks: FC<Props> = ({
  className, technicalRisks, vulnerableCodeDetectors, hardcodedLogic, isVerified,
}) => (
  <div className={cn(styles.wrap, className)}>
    <TechnicalRisks risks={technicalRisks} className={styles.risk} isVerified={isVerified} />
    {/* <SuspiciousActivity risks={suspiciousActivity} className={styles.risk} /> */}
    <VulnerableCodeDetectors risks={vulnerableCodeDetectors} className={styles.risk} isVerified={isVerified} />
    <HardcodedLogic risks={hardcodedLogic} className={styles.risk} isVerified={isVerified} />
  </div>
);

Risks.defaultProps = {
  className: '',
  isVerified: true,
};

export default Risks;
