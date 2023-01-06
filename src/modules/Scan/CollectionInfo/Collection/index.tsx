import { FC } from 'react';

import { roundNumber } from 'helpers/big-number.helpers';
import { getDateWithFormat } from 'helpers/time.helpers';
import { Collection as ICollection } from 'components/assetHeader/CollectionHeader/interfaces';
import CollectionItem from 'components/Collection';

import Warning from 'components/Warning';
import { isNull } from 'helpers/common.helpers';
import styles from './styles.module.scss';

const Collection: FC<ICollection> = ({
  hasRisk,
  address,
  collection,
  preview,
  isVerified,
  dateCreation,
  price,
  sales,
  quantity,
  owners,
  transactions,
  id,
  contractName,
}) => (
  <div className={styles.wrapper}>
    {hasRisk && (
      <Warning
        isDanger={false}
        message="The collection has been created just recently or has few transactions."
        className={styles.warning}
      />
    )}
    <CollectionItem
      collection={collection}
      preview={preview}
      isVerified={isVerified}
      address={address}
      id={String(id)}
    />
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
          <div className={styles.firstLabel}>Mkt cap</div>
          <div className={styles.firstCell}>{price && Number(roundNumber(price, 2)).toLocaleString()} ETH</div>
        </div>
      )}
      {!isNull(sales) && (
        <div className={styles.value}>
          <div className={styles.secondLabel}>Sales</div>
          <div className={styles.secondCell}>{sales && sales.toLocaleString()}</div>
        </div>
      )}
      {!isNull(quantity) && (
        <div className={styles.value}>
          <div className={styles.firstLabel}>Items</div>
          <div className={styles.firstCell}>{quantity && quantity.toLocaleString()}</div>
        </div>
      )}
      {!isNull(owners) && (
        <div className={styles.value}>
          <div className={styles.secondLabel}>Owners</div>
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
  preview: '',
  dateCreation: '',
  price: 0,
  sales: 0,
  quantity: 0,
  owners: 0,
  transactions: 0,
} as ICollection;

export default Collection;
