import { FC } from 'react';

import { formatNumberWithComas, getPercentFromValues, roundNumber } from 'helpers/big-number.helpers';
import { getDateWithFormat } from 'helpers/time.helpers';
import InfoPopup from 'components/InfoPopup';
import BigValue from 'components/BigValue';
import { MintingData } from '../../Scan/interfaces';

import styles from './styles.module.scss';

export interface Props {
  contract: string
  dateCreation?: string
  tokenType: string
  price?: number
  minting?: MintingData
}

const Token: FC<Props> = ({
  contract,
  dateCreation,
  tokenType,
  price,
  minting,
}) => (
  <div className={styles.wrapper}>
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

      {Boolean(minting?.total)
      && (
        <>
          <div className={styles.value}>
            <div className={styles.secondLabel}>
              Circulating supply <InfoPopup
                position="bottom center"
                content="Number of the contract's minted tokens currently in supply."
              />
            </div>
            <div className={styles.secondCell}>
              <BigValue value={String(minting?.total)} />
              {Boolean(minting?.total && minting?.cap)
              && (
                <span className={styles.percent}>
                  {' '}({roundNumber(getPercentFromValues(minting?.total as string, minting?.cap as string))}%)
                </span>
              )}
            </div>
          </div>
          <div className={styles.value}>
            <div className={styles.secondLabel}>
              Max supply <InfoPopup
                position="bottom center"
                content="Number of tokens the contract can mint."
              />
            </div>
            <div className={styles.secondCell}>{minting?.cap ? <BigValue value={String(minting?.cap)} /> : '∞'}</div>
          </div>
        </>
      )}
    </div>
  </div>
);

Token.defaultProps = {
  dateCreation: '',
  price: undefined,
  minting: undefined,
};

export default Token;
