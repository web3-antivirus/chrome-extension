import { FC, useState } from 'react';
import cn from 'classnames';

import { formatAddress } from 'helpers/address.helpers';
import { copyText } from 'helpers/common.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import ethIcon from 'assets/images/icons/eth-icon.svg';
import checkIcon from 'assets/images/icons/check-circle.svg';
import alertIcon from 'assets/images/icons/alert-circle.svg';
import Popup from 'components/Popup';
import { getEtherscanAddressUrl } from 'helpers/url.helpers';

import { CheckedCircleIcon, CopyIcon } from 'constants/icons.constants';
import styles from './styles.module.scss';

interface Props {
  address: string
  isVerified?: boolean;
  className?: string;
  withChainIcon?: boolean;
  alertOnNonVerified?: boolean;
}

const Address: FC<Props> = ({
  address, isVerified, className, withChainIcon, alertOnNonVerified,
}) => {
  const [isOpenCopyPopup, setIsOpenCopyPopup] = useState(false);

  const handleCopy = async () => {
    await copyText(address);
    setIsOpenCopyPopup(true);
    setTimeout(() => setIsOpenCopyPopup(false), 1000);
  };

  return (
    <div className={cn(styles.wrap, className)}>
      {withChainIcon && (
        <Popup
          content="Chain: Ethereum"
          trigger={<img className={styles.ethIcon} src={getImageUrl(ethIcon)} alt="ethereum" />}
        />
      )}
      <Popup
        content={address}
        trigger={(
          <a href={getEtherscanAddressUrl(address)} target="_blank" rel="noreferrer" className={styles.address}>
            {formatAddress(address)}
          </a>
        )}
      />
      {(isVerified !== undefined && (isVerified || alertOnNonVerified))
      && (
        <Popup
          styleType="white"
          content={isVerified ? 'Verified by Etherscan' : 'Not verified by Etherscan'}
          trigger={<img className={styles.verifiedIcon} src={getImageUrl(isVerified ? checkIcon : alertIcon)} alt="verified" />}
        />
      )}
      <Popup
        styleType="white"
        content="Copied!"
        open={isOpenCopyPopup}
        position="bottom center"
        trigger={(
          <button onClick={handleCopy} className={styles.copyBtn}>
            {isOpenCopyPopup ? <CheckedCircleIcon /> : <CopyIcon classNames={styles.copyIcon} />}
          </button>
        )}
      />
    </div>
  );
};

Address.defaultProps = {
  isVerified: undefined,
  className: '',
  withChainIcon: true,
  alertOnNonVerified: false,
};

export default Address;
