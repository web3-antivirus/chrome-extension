import Popup from 'components/Popup';
import { FC } from 'react';
import washTradingIcon from 'assets/images/icons/wash-trading.svg';
import { roundNumber } from 'helpers/big-number.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import { IWashTradingData } from './interfaces';
import styles from './styles.module.scss';

const WashTrading: FC<IWashTradingData> = ({ washTrades, washTradesPercent, totalTrades }) => (
  <div className={styles.washTrading}>
    <img src={getImageUrl(washTradingIcon)} alt="" />
    {washTradesPercent >= 30 && (
      <Popup
        position="top center"
        trigger={(
          <div className={styles.percent}>{roundNumber(washTradesPercent, 2)}%</div>
        )}
        content={(
          <div className={styles.washTradingPopup}>
            <div className={styles.row}>
              <div className={styles.name}>Total trades</div>
              <div className={styles.value}>{totalTrades}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.name}>Wash trades</div>
              <div className={styles.value}>
                <span className={styles.count}>{washTrades}</span>
                <span className={styles.percent}>{roundNumber(washTradesPercent, 2)}%</span>
              </div>
            </div>
          </div>
        )}
      />
    )}
  </div>
);

export default WashTrading;
