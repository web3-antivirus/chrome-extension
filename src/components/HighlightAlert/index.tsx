import { REQUEST_OPEN_TRACING_DIAGRAM_PAGE } from 'constants/chrome-send-message.constants';
import { FC } from 'react';
import cn from 'classnames';
import browser from 'webextension-polyfill';
import { RISK_ALERT_ICONS } from 'constants/risks.constants';
import { getImageUrl } from 'helpers/image.helpers';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';
import { Trace } from 'types/fetch.type';
import { roundNumber } from 'helpers/big-number.helpers';

import styles from './styles.module.scss';

interface Props {
  data: IHighlightAlert
  className?: string
}

const HighlightAlert: FC<Props> = ({ data, className }) => {
  const handleTraceClick = (trace: Trace[]) => {
    browser.runtime.sendMessage({ message: REQUEST_OPEN_TRACING_DIAGRAM_PAGE, trace }).catch(() => null);
  };

  const getAlertText = (alert: IHighlightAlert) => {
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

    if (alert.website) {
      return (
        <span>
          {alert.website.name && <b>{alert.website.name} </b>}
          {alert.website.text}
        </span>
      );
    }

    if (alert.fairPricePercent) {
      return (
        <span>Your offer is <b>{alert.fairPricePercent}% </b>{alert.fairPricePercent < 0 ? 'lower' : 'higher'} than the fair price</span>
      );
    }

    if (alert.washTradesPercent) {
      return (
        <span><b>{roundNumber(alert.washTradesPercent, 2)}% of wash trades </b>detected</span>
      );
    }

    if (alert.openseaVerifiedInfo) {
      return (
        <span>
          <b>{alert.openseaVerifiedInfo?.nftName} </b>
          {alert.openseaVerifiedInfo?.isVerified ? 'is verified by OpenSea' : 'is not verified by OpenSea'}
        </span>
      );
    }

    return alert.text;
  };

  return (
    <div className={cn(styles.alert, className)} key={data.text || data.contract?.name}>
      <img src={getImageUrl(data.icon || RISK_ALERT_ICONS[data.risk])} alt={data.risk} />
      <div className={styles.text}>
        {getAlertText(data)}
      </div>
    </div>
  );
};

HighlightAlert.defaultProps = {
  className: '',
};

export default HighlightAlert;
