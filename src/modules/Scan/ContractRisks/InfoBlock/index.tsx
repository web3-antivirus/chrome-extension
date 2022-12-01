import { FC, memo } from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';

type Props = {
  title: string;
  value: string;
  classNames?: string,
};

const InfoBlock: FC<Props> = ({ value, title, classNames }) => (
  <div className={cn(styles.wrapper, classNames)}>
    <p className={styles.title}>{title}</p>
    <p className={styles.value}>{value}</p>
  </div>
);

InfoBlock.defaultProps = {
  classNames: '',
};

export default memo(InfoBlock);
