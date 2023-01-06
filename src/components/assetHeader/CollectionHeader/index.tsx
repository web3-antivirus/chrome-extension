import { FC } from 'react';

import Address from 'components/Address';
import NftItem from 'components/Nft';
import { getNftName } from 'helpers/common.helpers';

import { Nft } from './interfaces';
import AssetHeader from '..';

interface Props {
  handleGoBack: () => void;
  nfts: Nft[];
  address: string;
  isAddressVerified?: boolean;
  collectionId: string;
}
const CollectionHeader: FC<Props> = ({
  handleGoBack, nfts, address, isAddressVerified, collectionId,
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
      <Address address={address} isVerified={isAddressVerified} />
    </div>
  </AssetHeader>
);

CollectionHeader.defaultProps = {
  isAddressVerified: false,
};

export default CollectionHeader;
