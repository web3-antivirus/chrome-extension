import { FC } from 'react';
import cn from 'classnames';
import InfoPopup from 'components/InfoPopup';
import alertIcon from 'assets/images/icons/danger.svg';
import { getImageUrl } from 'helpers/image.helpers';
import { ApprovesDetails } from 'modules/Scan/interfaces';

import Address from 'components/Address';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  data: ApprovesDetails[];
}

const PermissionRequest: FC<Props> = ({
  className, data,
}) => (
  <div className={cn(styles.wrap, className)}>
    <div className={styles.sectionTitle}>
      <span>Permission requests</span>
      <InfoPopup content="Permission request method allows a third-party to get access to your tokens and manage them." />
    </div>

    {data.map(({ approvedAsset, hasRisk, address }, index) => (
      <div className={styles.approve} key={address}>
        <div className={styles.header}>
          {hasRisk && <img className={styles.alertIcon} src={getImageUrl(alertIcon)} alt="" />}
          <span className={cn(styles.title, { [styles.hasRisk]: hasRisk })}>Permission {index + 1}</span>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>Approved asset:</div>
          <div className={styles.value}>{approvedAsset}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>Granted to:</div>
          <div className={styles.value}><Address address={address} className={styles.address} withChainIcon={false} /></div>
        </div>
      </div>
    ))}
  </div>
);

PermissionRequest.defaultProps = {
  className: '',
};

export default PermissionRequest;
