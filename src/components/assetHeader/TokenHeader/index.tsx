import { FC } from 'react';

import Address from 'components/Address';

import AssetHeader from '..';
import styles from './styles.module.scss';

interface Props {
  handleGoBack: () => void;
  address: string;
  name: string;
  isAddressVerified: boolean;
}

const TokenHeader: FC<Props> = ({
  handleGoBack, address, isAddressVerified, name,
}) => (
  <AssetHeader handleGoBack={handleGoBack}>
    <div>
      <h1 className={styles.name}>{name}</h1>
      {address && <Address address={address} isVerified={isAddressVerified} />}
    </div>
  </AssetHeader>
);

export default TokenHeader;
