import { FC, memo } from 'react';
import { BigNumber } from 'bignumber.js';
import cn from 'classnames';
import Popup from 'components/Popup';
import { MAX_VALUE_FOR_ABBREVIATE, abbreviateNumber, formatNumberWithComas } from 'helpers/big-number.helpers';
import styles from './styles.module.scss';

type Props = {
  value: string | number
  className?: string
}

const BigValue: FC<Props> = ({ value, className }) => {
  const isBig = new BigNumber(value).isGreaterThan(MAX_VALUE_FOR_ABBREVIATE);

  return isBig ? (
    <Popup
      styleType="white"
      position="bottom left"
      className={styles.popup}
      trigger={(
        <span
          className={cn(styles.wrap, styles.bigValue, className)}
        >{abbreviateNumber(Number(value))}+
        </span>
      )}
    >
      {formatNumberWithComas(value)}
    </Popup>
  ) : (
    <span
      className={cn(styles.wrap, className)}
    >{value}
    </span>
  );
};

BigValue.defaultProps = {
  className: '',
};

export default memo(BigValue);
