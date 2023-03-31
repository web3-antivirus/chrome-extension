import { FC } from 'react';

import { roundNumber } from 'helpers/big-number.helpers';
import { getDateWithFormat } from 'helpers/time.helpers';

import Message from 'components/Message';
import { isNull } from 'helpers/common.helpers';
import { MESSAGE_TYPES } from 'components/Message/constants';
import styles from './styles.module.scss';

interface Props {
  hasRisk?: boolean,
  dateCreation?: string,
  price?: number,
  sales?: number,
  quantity?: number,
  owners?: number,
  transactions?: number,
  contractName?: string,
}

const Collection: FC<Props> = ({
  hasRisk,
  dateCreation,
  price,
  sales,
  quantity,
  owners,
  transactions,
  contractName,
}) => (
  <div className={styles.wrapper}>
    {hasRisk && (
      <Message
        messageType={MESSAGE_TYPES.WARNING}
        message="The collection has been created just recently or has low transaction volume. Please make sure it is not a scam!"
        title="Unpopular collection"
        className={styles.warning}
      />
    )}
    <div className={styles.values}>
      {Boolean(contractName) && (
        <div className={styles.value}>
          <div className={styles.firstLabel}>Contract name</div>
          <div className={styles.firstCell}>{contractName}</div>
        </div>
      )}
      {Boolean(dateCreation) && (
        <div className={styles.value}>
          <div className={styles.secondLabel}>Contract creation date</div>
          <div className={styles.secondCell}>
            {getDateWithFormat(dateCreation)}
          </div>
        </div>
      )}
      {!isNull(price) && (
        <div className={styles.value}>
          <div className={styles.firstLabel}>Market cap</div>
          <div className={styles.firstCell}>{price && Number(roundNumber(price, 2)).toLocaleString()} ETH</div>
        </div>
      )}
      {!isNull(sales) && (
        <div className={styles.value}>
          <div className={styles.secondLabel}>Sales (All)</div>
          <div className={styles.secondCell}>{sales && sales.toLocaleString()}</div>
        </div>
      )}
      {!isNull(quantity) && (
        <div className={styles.value}>
          <div className={styles.firstLabel}>Tokens</div>
          <div className={styles.firstCell}>{quantity && quantity.toLocaleString()}</div>
        </div>
      )}
      {!isNull(owners) && (
        <div className={styles.value}>
          <div className={styles.secondLabel}>Holders</div>
          <div className={styles.secondCell}>{owners && owners.toLocaleString()}</div>
        </div>
      )}
      {isNull(sales) && (
        <div className={styles.value}>
          <div className={styles.firstLabel}>Transactions</div>
          <div className={styles.firstCell}>
            {transactions && transactions.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  </div>
);

Collection.defaultProps = {
  hasRisk: false,
  dateCreation: '',
  price: 0,
  sales: 0,
  quantity: 0,
  owners: 0,
  transactions: 0,
  contractName: '',
};

export default Collection;
