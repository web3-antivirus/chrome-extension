import { FC } from 'react';

import Address from 'components/Address';
import NftItem from 'components/Nft';
import { getNftName } from 'helpers/common.helpers';

import { Nft } from './interfaces';
import AssetHeader from '..';
import styles from './styles.module.scss';

interface Props {
  handleGoBack: () => void;
  nfts: Nft[];
  address: string;
  isAddressVerified?: boolean;
  collectionId: string;
  description?: string;
}
const CollectionHeader: FC<Props> = ({
  handleGoBack, nfts, address, isAddressVerified, collectionId, description,
}) => (
  <AssetHeader handleGoBack={handleGoBack}>
    <div>
      {nfts.map((nft) => (
        <NftItem
          {...nft}
          name={getNftName(nft.id as string, nft.name)}
          key={nft.id}
          id={nft.id}
          address={address}
          collectionId={collectionId}
        />
      ))}
      {description && <div className={styles.description}>{description}</div>}
      <Address address={address} isVerified={isAddressVerified} />
    </div>
  </AssetHeader>
);

CollectionHeader.defaultProps = {
  isAddressVerified: false,
  description: '',
};

export default CollectionHeader;
