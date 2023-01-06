import { FC, ReactNode } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

interface Props {
  className?: string
  data: ReactNode
}

const Message: FC<Props> = ({ className, data }) => (
  <div className={cn(styles.wrap, className)}>{data}</div>
);

Message.defaultProps = {
  className: '',
};

export default Message;
