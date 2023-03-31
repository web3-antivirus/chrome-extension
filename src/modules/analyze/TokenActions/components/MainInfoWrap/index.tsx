import { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
}

const MainInfoWrap: FC<Props> = ({ children }) => (
  <div className={styles.wrap}>
    {children}
  </div>
);

export default MainInfoWrap;
