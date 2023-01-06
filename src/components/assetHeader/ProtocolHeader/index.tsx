import { FC } from 'react';
import cn from 'classnames';
import { getImageUrl } from 'helpers/image.helpers';
import verifiedIcon from 'assets/images/icons/verified-redesign.svg';
import alertIcon from 'assets/images/icons/danger.svg';
import Address from 'components/Address';
import AssetHeader from '..';

import styles from './styles.module.scss';

interface Props {
  handleGoBack: () => void;
  name: string;
  isVerified?: boolean;
  hasRisk?: boolean;
  address?: string;
  isAddressVerified?: boolean;
  description?: string;
}
const ProtocolHeader: FC<Props> = ({
  handleGoBack, name, isVerified, hasRisk, address, isAddressVerified, description,
}) => (
  <AssetHeader handleGoBack={handleGoBack}>
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1>{name}</h1>
        {isVerified && (
          <img
            className={cn(styles.icon, styles.verifiedIcon)}
            src={getImageUrl(verifiedIcon)}
            alt="verified"
          />
        )}
        {hasRisk && (
          <img
            className={cn(styles.icon, styles.risksIcon)}
            src={getImageUrl(alertIcon)}
            alt="has risks"
          />
        )}
      </div>
      {description && <div className={styles.description}>{description}</div>}
      {address && <Address className={styles.address} address={address} isVerified={isAddressVerified} />}
    </div>
  </AssetHeader>
);

ProtocolHeader.defaultProps = {
  isVerified: false,
  hasRisk: false,
  address: '',
  isAddressVerified: false,
  description: '',
};

export default ProtocolHeader;
