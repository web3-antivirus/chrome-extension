import { FC } from 'react';

import HighlightAlert from 'components/HighlightAlert';
import { ISignMessage } from 'interfaces/common.interfaces';
import { IHighlightAlert } from 'modules/analyze/Scan/ScanningResult/interfaces';

import { isValidEthereumAddress } from 'helpers/web3.helpers';
import { formatAddress } from 'helpers/address.helpers';
import { getEtherscanAddressUrl } from 'helpers/url.helpers';
import { useExtensionScroll } from 'hooks/common.hooks';
import styles from './styles.module.scss';

interface Props {
  urlAlert: IHighlightAlert;
  message: ISignMessage;
}

const renderObjMessage = (obj: Record<string, string>) => Object.keys(obj).map((field) => (
  <div className={styles.row}>
    <div className={styles.field}>{field}:</div>
    <div className={styles.value}>{isValidEthereumAddress(obj[field]) ? (
      <a href={getEtherscanAddressUrl(obj[field])} target="_blank" rel="noreferrer" className={styles.address}>
        {formatAddress(obj[field])}
      </a>
    ) : String(obj[field])}
    </div>
  </div>
));

const SignMessage: FC<Props> = ({
  urlAlert, message,
}) => {
  useExtensionScroll(styles.message);
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Signature requested</div>
        <HighlightAlert data={urlAlert} className={styles.alert} />
      </div>
      <div className={styles.messageWrap}>
        <div className={styles.title}>Message</div>
        <div className={styles.message}>{typeof message !== 'string' ? renderObjMessage(message) : message}</div>
      </div>
    </>
  );
};

export default SignMessage;
