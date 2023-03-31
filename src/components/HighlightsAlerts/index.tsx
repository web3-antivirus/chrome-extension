import { FC } from 'react';

import HighlightAlert from 'components/HighlightAlert';
import InfoPopup from 'components/InfoPopup';

import { IHighlightAlert } from '../../modules/analyze/Scan/ScanningResult/interfaces';
import styles from './styles.module.scss';

interface Props {
  alerts: IHighlightAlert[]
}

const HighlightsAlerts: FC<Props> = ({ alerts }) => (
  <div className={styles.wrap}>
    <div className={styles.header}>
      <h3>Highlights & alerts</h3>
      <InfoPopup content="Highlights and alerts are defined with the help of ML algorithm, whitelists and blacklists." />
    </div>
    <div className={styles.alerts}>
      {alerts.map((alert) => (
        <HighlightAlert data={alert} key={alert.text || alert.contract?.name} className={styles.alert} />
      ))}
    </div>
  </div>
);

export default HighlightsAlerts;
