import { FC } from 'react';
import PermissionRequest from 'components/PermissionRequest';
import SwapInfo from 'components/SwapInfo';
import Message from 'components/Message';
import { ApprovesDetails, MessageData, SwapDetails } from 'modules/analyze/Scan/interfaces';
import { MESSAGE_TYPES } from 'components/Message/constants';
import styles from './styles.module.scss';
import { getDetailsMessage } from './helpers';

interface Props {
  swap: SwapDetails | null;
  permissionRequest: ApprovesDetails[] | null
  dangerMessages?: MessageData[] | null;
  warningMessages?: MessageData[] | null;
}

const Details: FC<Props> = ({
  swap, permissionRequest, dangerMessages, warningMessages,
}) => {
  const swapMessage = getDetailsMessage(swap, permissionRequest);
  return (
    <div className={styles.wrap}>
      {swapMessage && (
        <Message
          message={swapMessage}
          className={styles.message}
          messageType={(swap?.loss.length && !swap.income.length) ? MESSAGE_TYPES.WARNING : MESSAGE_TYPES.INFO}
        />
      )}
      {Boolean(dangerMessages?.length) && dangerMessages?.map(({ title, message }) => (
        <Message
          key={message}
          title={title}
          message={message}
          className={styles.warning}
          messageType={MESSAGE_TYPES.DANGER}
        />
      ))}
      {Boolean(warningMessages?.length) && warningMessages?.map(({ title, message }) => (
        <Message
          key={message}
          title={title}
          message={message}
          className={styles.warning}
          messageType={MESSAGE_TYPES.WARNING}
        />
      ))}
      {swap && <SwapInfo data={swap} className={styles.swap} />}
      {permissionRequest && <PermissionRequest data={permissionRequest} className={styles.permissionRequest} />}
    </div>
  );
};

Details.defaultProps = {
  dangerMessages: null,
  warningMessages: null,
};

export default Details;
