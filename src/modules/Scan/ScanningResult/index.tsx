import { FC } from 'react';
import { Web3ContractEntity } from 'interfaces/analyze.interfaces';

import TotalRisks from './TotalRisks';
import styles from './styles.module.scss';
import HighlightsAlerts from './HighlightsAlerts';
import { HighlightAlert, ProtocolRisks } from './interfaces';
import { TokenData } from '../interfaces';

interface Props {
  alerts: HighlightAlert[];
  risks: ProtocolRisks[];
  handleTokenSelect: (token: TokenData, type: Web3ContractEntity.type) => void;
}

const ScanningResult: FC<Props> = ({
  alerts, risks, handleTokenSelect,
}) => (
  <>
    <div className={styles.wrap}>
      <TotalRisks risks={risks} handleTokenSelect={handleTokenSelect} />
      <HighlightsAlerts alerts={alerts} />
    </div>
  </>
);

export default ScanningResult;
