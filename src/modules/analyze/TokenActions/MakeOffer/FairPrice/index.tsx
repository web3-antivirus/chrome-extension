import { FC } from 'react';
import cn from 'classnames';

import InfoPopup from 'components/InfoPopup';
import { roundNumber } from 'helpers/big-number.helpers';
import Popup from 'components/Popup';
import { FAIR_LEVEL, FAIR_LEVEL_TOOLTIPS } from '../constants';

import styles from './styles.module.scss';

interface Props {
  fairLevel: FAIR_LEVEL | null
  price?: string
  symbol: string
  percent?: number
}

const FairPrice: FC<Props> = ({
  fairLevel, price, percent, symbol,
}) => (
  <div className={styles.wrap}>
    <div className={styles.info}>
      <div className={styles.title}>Estimated fair price interval</div>
      <InfoPopup content="A reasonable price to pay for an NFT formed by an ML model based on relevant metrics and previous sales." />
      {fairLevel && (
        <Popup
          content={FAIR_LEVEL_TOOLTIPS[fairLevel]}
          trigger={(
            <div className={cn(styles.label, {
              [styles.high]: fairLevel === FAIR_LEVEL.HIGH,
              [styles.medium]: fairLevel === FAIR_LEVEL.MEDIUM,
              [styles.low]: fairLevel === FAIR_LEVEL.LOW,
            })}
            >
              {fairLevel}
            </div>
          )}
        />
      )}
    </div>
    {price ? (
      <div className={styles.fairPrice}>
        <div className={styles.price}>
          {`${roundNumber(price, 4)} ${symbol}`}
        </div>
        {percent !== undefined && (
          <div className={styles.percent}>
            {roundNumber(percent, 2)}%
          </div>
        )}
      </div>
    ) : (
      <div className={styles.text}>
        There’s not enough data about the token&apos;s transaction history to estimate a fair price.
      </div>
    )}
  </div>
);

FairPrice.defaultProps = {
  price: '',
  percent: 0,
};

export default FairPrice;
