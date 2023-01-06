import { FC } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

interface Props {
  className?: string
}
const Loader: FC<Props> = ({ className }) => (
  <div className={cn(styles.wrap, className)}>
    <div className={styles.loader}>
      <div className={styles.mask} />
    </div>
  </div>
);

Loader.defaultProps = {
  className: '',
};

export default Loader;
