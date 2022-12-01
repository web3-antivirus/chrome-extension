import { FC, memo } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';

import logo from 'assets/images/no-token-avatar.svg';
import { Collection, Statistic } from 'types/fetch.type';
import { getImageUrl } from 'helpers/image.helpers';

import InfoBlock from '../InfoBlock';
import styles from '../styles.module.scss';

type Props = {
  collection: Collection;
  statistic: Statistic;
  contractCreatedAt: string;
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const ContractInfo: FC<Props> = ({
  contractCreatedAt,
  collection, statistic,
}) => (
  <>
    {(Boolean(collection.name) || Boolean(contractCreatedAt)) && (
      <div className={styles.contractName}>
        {Boolean(collection.name) && (
          <InfoBlock
            title="Contract Name"
            value={collection.name}
            classNames={styles.infoBlock}
          />
        )}
        {Boolean(contractCreatedAt) && (
          <InfoBlock
            title="Contract Creation Date"
            value={format(new Date(contractCreatedAt), 'MMM dd, yyyy, HH:mm')}
            classNames={styles.infoBlock}
          />
        )}
      </div>
    )}
    {!!Object.keys(collection).length && (collection.logo || collection.name)
      && (
        <div className={styles.collection}>
          <div className={cn(styles.collectionImg, { [styles.verified]: collection.isVerified })}>
            <img src={collection.logo || getImageUrl(logo)} alt={collection.name} className={styles.logo} />
          </div>
          {collection.name}
        </div>
      )}
    {Boolean(statistic) && (
      <div className={styles.marketInfoWrapper}>
        <div className={styles.marketInfo}>
          <InfoBlock
            title="Market Cap"
            value={`${formatter.format(statistic.marketCapUSD)}`}
            classNames={styles.infoBlock}
          />
          <InfoBlock
            title="Floor Price"
            value={`${formatter.format(statistic.floorPriceUSD)}`}
            classNames={styles.infoBlock}
          />
        </div>
        <div className={styles.marketInfo}>
          <InfoBlock
            title="Items"
            value={`${new Intl.NumberFormat().format(statistic.numOfTokens)}`}
            classNames={styles.infoBlock}
          />
          <InfoBlock
            title="Owners"
            value={`${new Intl.NumberFormat().format(statistic.numOfOwners)}`}
            classNames={styles.infoBlock}
          />
        </div>
      </div>
    )}
  </>
);

export default memo(ContractInfo);
