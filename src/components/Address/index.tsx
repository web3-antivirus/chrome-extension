import { FC, useState } from 'react';
import cn from 'classnames';

import { formatAddress } from 'helpers/address.helpers';
import { copyText } from 'helpers/common.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import ethIcon from 'assets/images/icons/eth-icon.svg';
import checkIcon from 'assets/images/icons/check-circle.svg';
import Popup from 'components/Popup';
import { getEtherscanAddressUrl } from 'helpers/url.helpers';

import { CheckedCircleIcon, CopyIcon } from 'constants/icons.constants';
import styles from './styles.module.scss';

interface Props {
  address: string
  isVerified?: boolean;
  className?: string;
  withChainIcon?: boolean;
}

const Address: FC<Props> = ({
  address, isVerified, className, withChainIcon,
}) => {
  const [isOpenCopyPopup, setIsOpenCopyPopup] = useState(false);

  const handleCopy = async () => {
    await copyText(address);
    setIsOpenCopyPopup(true);
    setTimeout(() => setIsOpenCopyPopup(false), 1000);
  };

  return (
    <div className={cn(styles.wrap, className)}>
      {withChainIcon && <img className={styles.ethIcon} src={getImageUrl(ethIcon)} alt="ethereum" />}
      <a href={getEtherscanAddressUrl(address)} target="_blank" rel="noreferrer" className={styles.address}>{formatAddress(address)}</a>
      {isVerified
      && (
        <Popup
          styleType="white"
          content="The contract verified by Etherscan"
          position="bottom right"
          trigger={<img className={styles.verifiedIcon} src={getImageUrl(checkIcon)} alt="verified" />}
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
  isVerified: false,
  className: '',
  withChainIcon: true,
};

export default Address;
