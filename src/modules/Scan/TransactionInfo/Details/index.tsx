import { FC } from 'react';
import Message from 'components/Message';
import PermissionRequest from 'components/PermissionRequest';
import SwapInfo from 'components/SwapInfo';
import Warning from 'components/Warning';
import { ApprovesDetails, SwapDetails } from 'modules/Scan/interfaces';
import styles from './styles.module.scss';
import { getDetailsMessage } from './helpers';

interface Props {
  swap: SwapDetails | null;
  permissionRequest: ApprovesDetails[] | null
  warning?: string | null;
}

const Details: FC<Props> = ({
  swap, permissionRequest, warning,
}) => {
  const message = getDetailsMessage(swap, permissionRequest);
  return (
    <div className={styles.wrap}>
      {message && <Message data={message} className={styles.message} />}
      {warning && <Warning message={warning} className={styles.warning} /> }
      {swap && <SwapInfo data={swap} className={styles.swap} />}
      {permissionRequest && <PermissionRequest data={permissionRequest} className={styles.permissionRequest} />}
    </div>
  );
};

Details.defaultProps = {
  warning: null,
};

export default Details;
