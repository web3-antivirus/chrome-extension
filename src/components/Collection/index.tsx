import { FC } from 'react';

import { getCollectionUrl } from 'helpers/url.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import collectionStubIcon from 'assets/images/collection/collection-stub.svg';
import verifiedIcon from 'assets/images/icons/verified-redesign.svg';

import styles from './styles.module.scss';

interface Props {
  address: string;
  id: string;
  collection: string;
  preview?: string;
  isVerified: boolean;
}
const Collection: FC<Props> = ({
  collection, preview, isVerified, address, id,
}) => (
  <a
    className={styles.item}
    target="_blank"
    rel="noreferrer"
    href={getCollectionUrl(address, id)}
  >
    <img
      className={styles.image}
      src={preview || getImageUrl(collectionStubIcon)}
      alt={collection}
    />
    {isVerified && <img src={getImageUrl(verifiedIcon)} alt="verified" className={styles.verifiedIcon} />}
    <h3 className={styles.collection}>{collection}</h3>
  </a>
);

Collection.defaultProps = {
  preview: '',
};

export default Collection;
