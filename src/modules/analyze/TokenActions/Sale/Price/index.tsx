import InfoPopup from 'components/InfoPopup';
import { roundNumber } from 'helpers/big-number.helpers';
import { FC } from 'react';
import styles from './styles.module.scss';

interface Props {
  amount: string;
  symbol: string;
}

const Price: FC<Props> = ({ amount, symbol }) => (
  <div className={styles.wrap}>
    <div className={styles.header}>
      <span>List price</span>
      <InfoPopup content="11" />
    </div>
    <div className={styles.price}>
      <span className={styles.value}>{roundNumber(amount, 2)} </span>
      <span className={styles.symbol}>{symbol}</span>
    </div>
  </div>
);

export default Price;
