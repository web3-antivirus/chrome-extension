import { FC } from 'react';

import { getImageUrl } from 'helpers/image.helpers';
import Token from 'components/Token';
import { TSocials } from 'components/Socials/interfaces';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import verifiedIcon from 'assets/images/icons/verified-redesign.svg';
import { AuditsData } from 'modules/analyze/Scan/interfaces';
import ContractAudits from 'components/ContractAudits';

import AssetHeader from '..';
import styles from './styles.module.scss';
import ContractInfo from '../components/ContractInfo';

interface Props {
  handleGoBack: () => void;
  address: string;
  name: string;
  isAddressVerified: boolean;
  description?: string;
  hasRisk?: boolean;
  isProxy?: boolean;
  socials?: TSocials;
  tokenImage?: string;
  isVerified?: boolean;
  link?: string;
  audits?: AuditsData;
  isRounded?: boolean;
}

const TokenHeader: FC<Props> = ({
  handleGoBack, address, isAddressVerified, name, description,
  hasRisk, isProxy, socials, tokenImage, isVerified, link, audits, isRounded,
}) => (
  <AssetHeader handleGoBack={handleGoBack}>
    <div>
      <Token
        name={name}
        link={link}
        image={tokenImage}
        icon={(hasRisk || isVerified) ? getImageUrl(hasRisk ? alertIcon : verifiedIcon) : ''}
        isRounded={isRounded}
      />
      {description && <div className={styles.description}>{description}</div>}
      <ContractInfo address={address} isAddressVerified={isAddressVerified} isProxy={isProxy} socials={socials} />
      {audits && <ContractAudits data={audits} />}
    </div>
  </AssetHeader>
);

TokenHeader.defaultProps = {
  description: '',
  hasRisk: false,
  isProxy: false,
  socials: undefined,
  tokenImage: '',
  isVerified: false,
  link: '',
  audits: undefined,
  isRounded: false,
};

export default TokenHeader;
