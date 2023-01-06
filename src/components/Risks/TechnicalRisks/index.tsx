import Accordion from 'components/Accordion';
import { FC } from 'react';
import cn from 'classnames';
import InfoPopup from 'components/InfoPopup';
import { TECHNICAL_RISKS, TECHNICAL_RISKS_INFO, TECHNICAL_RISKS_LABELS } from './constants';
import { TechnicalRisksData } from './interfaces';
import styles from './styles.module.scss';
import { RiskData } from '../interfaces';

interface Props {
  className?: string
  risks: RiskData<TechnicalRisksData>
}
const TechnicalRisks: FC<Props> = ({ className, risks }) => (
  <Accordion
    name="Technical risks"
    risksCount={risks.count}
    className={className}
    disabled={!risks.count}
    defaultOpen={Boolean(risks.count)}
  >
    <div className={styles.wrap}>
      {(Object.keys(risks.data) as Array<TECHNICAL_RISKS>).map((key) => (
        <div className={styles.risk} key={key}>
          <div className={cn(styles.icon, { [styles.hasRisk]: risks.data[key] })} />
          <span className={styles.name}>{TECHNICAL_RISKS_LABELS[key]}</span>
          <InfoPopup content={TECHNICAL_RISKS_INFO[key]} />
        </div>
      ))}
    </div>
  </Accordion>
);

TechnicalRisks.defaultProps = {
  className: '',
};
export default TechnicalRisks;
