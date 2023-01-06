import { FC, memo } from 'react';
import cn from 'classnames';
import { getImageUrl } from 'helpers/image.helpers';
import { RISK_OPTIONS, RISK_TYPE } from 'constants/risks.constants';

import Address from 'components/Address';
import styles from './styles.module.scss';

type Props = {
  riskType: RISK_TYPE
  message?: string
  address?: string
  isAddressVerified?: boolean
}

const HeaderRisk: FC<Props> = ({
  riskType, message, address, isAddressVerified,
}) => {
  const renderBlock = (icon: string, text: string) => (
    <div className={styles.main}>
      <img className={styles.icon} src={getImageUrl(icon)} alt={message || text} />
      <div className={styles.title}>{text}</div>
    </div>
  );

  return (
    <div className={cn(styles.wrapper, styles[riskType?.toLowerCase() || ''])}>
      {renderBlock(RISK_OPTIONS[riskType].icon, message || RISK_OPTIONS[riskType].title)}
      {address && <Address isVerified={isAddressVerified} address={address} />}
    </div>
  );
};

HeaderRisk.defaultProps = {
  message: '',
  address: '',
  isAddressVerified: false,
};

export default memo(HeaderRisk);
