import { FC, useMemo } from 'react';
import cn from 'classnames';
import Address from 'components/Address';
import Socials from 'components/Socials';
import { TSocials } from 'components/Socials/interfaces';
import styles from './styles.module.scss';

interface Props {
  className?: string
  address?: string;
  isAddressVerified?: boolean;
  isProxy?: boolean;
  socials?: TSocials;
}

const ContractInfo: FC<Props> = ({
  className, address, isAddressVerified, isProxy, socials,
}) => {
  const hasSocials = useMemo(() => Boolean(socials && Object.values(socials).filter((value) => value).length), [socials]);
  return ((address || isProxy || hasSocials) ? (
    <div className={cn(styles.wrap, className)}>
      {hasSocials && <Socials className={styles.socials} data={socials as TSocials} />}
      {address && <Address className={styles.address} address={address} isVerified={isAddressVerified} />}
      {isProxy && <div className={styles.proxy}>Proxy contract</div>}
    </div>
  ) : null);
};

ContractInfo.defaultProps = {
  className: '',
  address: '',
  isAddressVerified: false,
  isProxy: false,
  socials: undefined,
};

export default ContractInfo;
