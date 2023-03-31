import { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
  title: string;
}

const HeaderWrap: FC<Props> = ({ children, title }) => (
  <div className={styles.wrap}>
    <div className={styles.titleWrap}>
      <div className={styles.title}>{title}</div>
    </div>
    {children}
  </div>
);

export default HeaderWrap;
