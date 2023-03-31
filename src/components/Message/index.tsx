import { FC, ReactNode } from 'react';
import cn from 'classnames';
import { getImageUrl } from 'helpers/image.helpers';
import styles from './styles.module.scss';
import { ICONS_BY_MESSAGE_TYPE, MESSAGE_TYPES } from './constants';

interface Props {
  className?: string;
  title?: string;
  message: string | ReactNode;
  messageType?: MESSAGE_TYPES
}

const Message: FC<Props> = ({
  className, title, message, messageType = MESSAGE_TYPES.INFO,
}) => (
  <div className={cn(styles.wrap, className)}>
    <div className={styles.icon}>
      <img src={getImageUrl(ICONS_BY_MESSAGE_TYPE[messageType])} alt={messageType} />
    </div>
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>
      <div className={styles.message}>{message}</div>
    </div>
  </div>
);

Message.defaultProps = {
  className: '',
  title: 'Transaction changes',
  messageType: MESSAGE_TYPES.INFO,
};

export default Message;
