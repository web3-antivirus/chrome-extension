import InfoPopup from 'components/InfoPopup';
import { formatNumberWithComas, roundNumber } from 'helpers/big-number.helpers';
import { isNull } from 'helpers/common.helpers';
import { FC } from 'react';
import styles from './styles.module.scss';

interface Props {
  cryptoPrice?: string | null;
  usdPrice?: number;
  title: string;
  popupText: string;
  symbol?: string;
}

const Price: FC<Props> = ({
  cryptoPrice, usdPrice, title, popupText, symbol,
}) => (
  <div className={styles.wrap}>
    <div className={styles.header}>
      <span>{title}</span>
      <InfoPopup content={popupText} />
    </div>
    <div className={styles.price}>
      <span className={styles.value}>
        {isNull(cryptoPrice) ? `$${formatNumberWithComas(usdPrice as number)}` : roundNumber(cryptoPrice as string, 2)}
      </span>
      {Boolean(symbol) && <span className={styles.symbol}> {symbol}</span>}
    </div>
  </div>
);

Price.defaultProps = {
  cryptoPrice: undefined,
  usdPrice: undefined,
  symbol: '',
};

export default Price;
