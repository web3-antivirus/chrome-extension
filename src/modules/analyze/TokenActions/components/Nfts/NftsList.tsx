import { FC } from 'react';
import cn from 'classnames';
import { INftDetails } from 'modules/analyze/Scan/interfaces';
import TokenImage from 'components/TokenImage';
import styles from './styles.module.scss';

interface Props {
  data: INftDetails[]
}

const DISPLAYED_COUNT = 5;

const NftsList: FC<Props> = ({ data }) => {
  const displayedNfts = data.slice(0, DISPLAYED_COUNT);
  const hidedCount = data.length - 5;

  return (
    <div className={styles.nftsList}>
      <div className={styles.list}>
        {displayedNfts.map(({ imageSrc, name }) => (
          <TokenImage key={imageSrc} className={cn(styles.nftImage, styles.item)} src={imageSrc} alt={name} />
        ))}
        {hidedCount > 0 && <div className={cn(styles.count, styles.item)}>+{hidedCount}</div>}
      </div>
      <div className={styles.collectionName}>{data[0].collectionName}</div>
    </div>
  );
};

export default NftsList;
