import BackButton from 'components/BackButton';
import React, { FC } from 'react';
import styles from './styles.module.scss';

interface Props {
  handleGoBack: () => void;
  children: React.ReactNode
}

const AssetHeader: FC<Props> = ({ handleGoBack, children }) => (
  <div className={styles.wrap}>
    <BackButton onClick={handleGoBack} className={styles.backBtn} />
    {children}
  </div>
);

export default AssetHeader;
