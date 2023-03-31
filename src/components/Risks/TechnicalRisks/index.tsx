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
  isVerified?: boolean,
}
const TechnicalRisks: FC<Props> = ({ className, risks, isVerified }) => (
  <Accordion
    name="Technical risks"
    risksCount={risks.count}
    className={className}
    isVerified={isVerified}
    defaultOpen={Boolean(risks.count)}
  >
    <div className={styles.wrap}>
      {(Object.keys(risks.data) as Array<TECHNICAL_RISKS>).map((key) => {
        const hasRisk = risks.data[key];
        return (
          <div className={styles.risk} key={key}>
            <div className={cn(styles.icon, { [styles.hasRisk]: hasRisk })} />
            <span className={styles.name}>{TECHNICAL_RISKS_LABELS[key](hasRisk)}</span>
            <InfoPopup content={TECHNICAL_RISKS_INFO[key]} />
          </div>
        );
      })}
    </div>
  </Accordion>
);

TechnicalRisks.defaultProps = {
  className: '',
  isVerified: true,
};
export default TechnicalRisks;
