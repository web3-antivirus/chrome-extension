import InfoPopup from 'components/InfoPopup';
import { REQUEST_OPEN_TRACING_DIAGRAM_PAGE } from 'constants/chrome-send-message.constants';
import { RISK_ALERT_ICONS } from 'constants/risks.constants';
import { getImageUrl } from 'helpers/image.helpers';
import { FC } from 'react';
import { Trace } from 'types/fetch.type';
import { HighlightAlert } from '../interfaces';
import styles from './styles.module.scss';

interface Props {
  alerts: HighlightAlert[]
}

const HighlightsAlerts: FC<Props> = ({ alerts }) => {
  const handleTraceClick = (trace: Trace[]) => {
    chrome.runtime.sendMessage({ message: REQUEST_OPEN_TRACING_DIAGRAM_PAGE, trace });
  };

  const getAlertText = (alert: HighlightAlert) => {
    if (alert.contract) {
      return <span><b>{alert.contract?.name} </b>{alert.contract?.verified ? 'contract is verified' : 'contract is not verified'}</span>;
    }

    if (alert.simulation) {
      return (
        <>
          Simulation detected dangerous contracts.
          Learn more in <button onClick={() => handleTraceClick(alert.simulation as Trace[])}>Transaction simulation</button>
        </>
      );
    }

    return alert.text;
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3>Highlights & alerts</h3>
        <InfoPopup content="Highlights and alerts are defined with the help of ML algorithm, whitelists and blacklists." />
      </div>
      <div className={styles.alerts}>
        {alerts.map((alert) => (
          <div className={styles.alert} key={alert.text || alert.contract?.name}>
            <img src={getImageUrl(RISK_ALERT_ICONS[alert.risk])} alt={alert.risk} />
            <div className={styles.text}>
              {getAlertText(alert)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightsAlerts;
