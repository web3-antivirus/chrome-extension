import { FC } from 'react';

import { formatNumberWithComas } from 'helpers/big-number.helpers';
import { getDateWithFormat } from 'helpers/time.helpers';
import TokenItem from 'components/Token';

import styles from './styles.module.scss';

export interface Props {
  name: string
  image?: string
  contract: string
  dateCreation?: string
  tokenType: string
  price?: number
}

const Token: FC<Props> = ({
  name,
  image,
  contract,
  dateCreation,
  tokenType,
  price,
}) => (
  <div className={styles.wrapper}>
    <TokenItem
      name={name}
      image={image}
    />
    <div className={styles.values}>
      <div className={styles.value}>
        <div className={styles.firstLabel}>Contract name</div>
        <div className={styles.firstCell}>{contract}</div>
      </div>
      {Boolean(dateCreation)
        && (
          <div className={styles.value}>
            <div className={styles.secondLabel}>Contract creation date</div>
            <div className={styles.secondCell}>
              {getDateWithFormat(dateCreation)}
            </div>
          </div>
        )}
      <div className={styles.value}>
        <div className={styles.firstLabel}>Token type</div>
        <div className={styles.firstCell}>{tokenType}</div>
      </div>
      {Boolean(price)
      && (
        <div className={styles.value}>
          <div className={styles.secondLabel}>Price</div>
          <div className={styles.secondCell}>{price && formatNumberWithComas(price)}$</div>
        </div>
      )}
    </div>
  </div>
);

Token.defaultProps = {
  dateCreation: '',
  price: undefined,
  image: '',
};

export default Token;
