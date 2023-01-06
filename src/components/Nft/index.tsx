import { FC } from 'react';

import { getImageUrl } from 'helpers/image.helpers';
import { getCollectionUrl, getTokenUrl } from 'helpers/url.helpers';
import nftStubIcon from 'assets/images/collection/nft-stub.svg';
import TokenImage from 'components/TokenImage';

import styles from './styles.module.scss';

interface Props {
  name: string;
  collection: string;
  address: string;
  id: string | number;
  preview?: string;
  collectionId: string;
}
const Nft: FC<Props> = ({
  name, collection, preview, address, id, collectionId,
}) => (
  <a
    className={styles.item}
    target="_blank"
    rel="noreferrer"
    href={getTokenUrl(address, String(id))}
  >
    <TokenImage
      className={styles.image}
      src={preview || getImageUrl(nftStubIcon)}
      alt={name}
    />
    <h3 className={styles.name}>{name}</h3>
    <a
      className={styles.collection}
      target="_blank"
      rel="noreferrer"
      href={getCollectionUrl(address, collectionId)}
    >{collection}
    </a>
  </a>
);

Nft.defaultProps = {
  preview: '',
};

export default Nft;
