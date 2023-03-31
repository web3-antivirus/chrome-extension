import { FC, ReactNode } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
}

const TopInfo: FC<Props> = ({ children, className }) => (
  <div className={cn(styles.wrap, className)}>{children}</div>
);

TopInfo.defaultProps = {
  className: '',
};

export default TopInfo;
