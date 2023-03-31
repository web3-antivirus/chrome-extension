import { FC } from 'react';
import cn from 'classnames';

import { getImageUrl } from 'helpers/image.helpers';
import verifiedIcon from 'assets/images/icons/verified-redesign.svg';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import { TSocials } from 'components/Socials/interfaces';
import Popup from 'components/Popup';
import ContractAudits from 'components/ContractAudits';
import { AuditsData } from 'modules/analyze/Scan/interfaces';

import AssetHeader from '..';
import styles from './styles.module.scss';
import ContractInfo from '../components/ContractInfo';

interface Props {
  handleGoBack: () => void;
  name: string;
  isVerified?: boolean;
  hasRisk?: boolean;
  address?: string;
  isAddressVerified?: boolean;
  description?: string;
  isProxy?: boolean;
  socials?: TSocials;
  audits?: AuditsData
}

const ProtocolHeader: FC<Props> = ({
  handleGoBack, name, isVerified, hasRisk, address, isAddressVerified, description, isProxy, socials, audits,
}) => (
  <AssetHeader handleGoBack={handleGoBack}>
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1>{name}</h1>
        {isVerified && (
          <Popup
            content="W3A verified"
            trigger={(
              <img
                className={cn(styles.icon, styles.verifiedIcon)}
                src={getImageUrl(verifiedIcon)}
                alt="verified"
              />
            )}
          />
        )}
        {hasRisk && (
          <Popup
            content="Not verified by Etherscan"
            trigger={(
              <img
                className={cn(styles.icon, styles.risksIcon)}
                src={getImageUrl(alertIcon)}
                alt="has risks"
              />
            )}
          />
        )}
      </div>
      {description && <div className={styles.description}>{description}</div>}
      <ContractInfo address={address} isAddressVerified={isAddressVerified} isProxy={isProxy} socials={socials} />
      {audits && <ContractAudits data={audits} />}
    </div>
  </AssetHeader>
);

ProtocolHeader.defaultProps = {
  isVerified: false,
  hasRisk: false,
  address: '',
  isAddressVerified: false,
  description: '',
  isProxy: false,
  socials: undefined,
  audits: undefined,
};

export default ProtocolHeader;
