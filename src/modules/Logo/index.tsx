import { FC, memo } from 'react';

import { getImageByTheme } from 'helpers/theme.helpers';
import { useCurrentTheme } from 'hooks/use-current-theme';
import logoDark from 'assets/images/icons/logo-dark.svg';
import logoLight from 'assets/images/icons/logo-white.svg';
import styles from './styles.module.scss';

const Logo: FC = () => {
  const { theme } = useCurrentTheme();

  const getHrefForLogo = () => process.env.REACT_APP_CHECK_NFT_W3A_PATH;

  return (
    <a href={getHrefForLogo()} target="_blank" rel="noreferrer" className={styles.logoWrapper}>
      <img src={getImageByTheme(theme, logoDark, logoLight)} alt="logo" className={styles.logo} />
    </a>
  );
};

export default memo(Logo);
