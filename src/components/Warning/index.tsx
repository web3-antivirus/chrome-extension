import { FC } from 'react';
import cn from 'classnames';
import alertIcon from 'assets/images/icons/danger.svg';
import { getImageUrl } from 'helpers/image.helpers';
import warningIcon from 'assets/images/icons/warning-circle.svg';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  title?: string;
  message: string;
  isDanger?: boolean;
}

const Warning: FC<Props> = ({
  className, title, message, isDanger,
}) => (
  <div className={cn(styles.wrap, className, { [styles.danger]: isDanger })}>
    <div className={styles.icon}>
      <img src={getImageUrl(isDanger ? alertIcon : warningIcon)} alt="warning" />
    </div>
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>
      <div className={styles.message}>{message}</div>
    </div>
  </div>
);

Warning.defaultProps = {
  className: '',
  title: 'Warning',
  isDanger: true,
};

export default Warning;
