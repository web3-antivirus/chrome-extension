import { FC } from 'react';
import FooterButtons from 'components/FooterButtons';
import { Web3ContractEntity } from 'interfaces/analyze.interfaces';

import TotalRisks from './TotalRisks';
import styles from './styles.module.scss';
import HighlightsAlerts from './HighlightsAlerts';
import { HighlightAlert, ProtocolRisks } from './interfaces';
import { TokenData } from '../interfaces';

interface Props {
  handleDecline: () => void;
  handleProceed: () => void;
  alerts: HighlightAlert[];
  risks: ProtocolRisks[];
  handleTokenSelect: (token: TokenData, type: Web3ContractEntity.type) => void;
}

const ScanningResult: FC<Props> = ({
  handleDecline, handleProceed, alerts, risks, handleTokenSelect,
}) => (
  <>
    <div className={styles.wrap}>
      <TotalRisks risks={risks} handleTokenSelect={handleTokenSelect} />
      <HighlightsAlerts alerts={alerts} />
    </div>
    <FooterButtons
      handleDecline={handleDecline}
      handleProceed={handleProceed}
      text="What would you like to do?"
    />
  </>
);

export default ScanningResult;
