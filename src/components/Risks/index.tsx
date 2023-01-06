import { FC } from 'react';
import cn from 'classnames';

import TechnicalRisks from './TechnicalRisks';
import styles from './styles.module.scss';
import { RisksData } from './interfaces';
import VulnerableCodeDetectors from './VulnerableCodeDetectors';
import HardcodedLogic from './HardcodedLogic';

type Props = RisksData & {
  className?: string
}

const Risks: FC<Props> = ({
  className, technicalRisks, vulnerableCodeDetectors, hardcodedLogic,
}) => (
  <div className={cn(styles.wrap, className)}>
    <TechnicalRisks risks={technicalRisks} className={styles.risk} />
    {/* <SuspiciousActivity risks={suspiciousActivity} className={styles.risk} /> */}
    <VulnerableCodeDetectors risks={vulnerableCodeDetectors} className={styles.risk} />
    <HardcodedLogic risks={hardcodedLogic} className={styles.risk} />
  </div>
);

Risks.defaultProps = {
  className: '',
};

export default Risks;
