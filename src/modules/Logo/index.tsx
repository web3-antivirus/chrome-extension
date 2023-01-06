import { FC, memo } from 'react';
import { getImageByTheme } from 'helpers/theme.helpers';
import { useCurrentTheme } from 'hooks/use-current-theme';
import logo from 'assets/images/icons/logo.svg';

import styles from './styles.module.scss';

const Logo: FC = () => {
  const { theme } = useCurrentTheme();
  return (
    <div className={styles.logoWrapper}>
      <img src={getImageByTheme(theme, logo, logo)} alt="logo" className={styles.logo} />
    </div>
  );
};

export default memo(Logo);
