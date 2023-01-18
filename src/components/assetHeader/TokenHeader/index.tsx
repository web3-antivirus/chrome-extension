import { FC } from 'react';
import cn from 'classnames';

import Address from 'components/Address';
import alertIcon from 'assets/images/icons/danger.svg';
import { getImageUrl } from 'helpers/image.helpers';

import AssetHeader from '..';
import styles from './styles.module.scss';

interface Props {
  handleGoBack: () => void;
  address: string;
  name: string;
  isAddressVerified: boolean;
  description?: string;
  hasRisk?: boolean;
}

const TokenHeader: FC<Props> = ({
  handleGoBack, address, isAddressVerified, name, description, hasRisk,
}) => (
  <AssetHeader handleGoBack={handleGoBack}>
    <div>
      <div className={styles.header}>
        <h1 className={styles.name}>{name}</h1>
        {hasRisk && (
          <img
            className={cn(styles.icon, styles.risksIcon)}
            src={getImageUrl(alertIcon)}
            alt="has risks"
          />
        )}
      </div>
      {description && <div className={styles.description}>{description}</div>}
      {address && <Address address={address} isVerified={isAddressVerified} />}
    </div>
  </AssetHeader>
);

TokenHeader.defaultProps = {
  description: '',
  hasRisk: false,
};

export default TokenHeader;
