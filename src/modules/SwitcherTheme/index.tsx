import { FC, useMemo } from 'react';
import cn from 'classnames';

import darkIcon from 'assets/images/theme/dark.svg';
import lightIcon from 'assets/images/theme/light.svg';
import { useCurrentTheme } from 'hooks/use-current-theme';
import { getCheckByTheme } from 'helpers/theme.helpers';
import { getImageUrl } from 'helpers/image.helpers';
import { THEME } from 'constants/theme.constants';
import styles from './styles.module.scss';

type Props = {
  //
};

const SwitcherTheme: FC<Props> = () => {
  const { theme, setTheme } = useCurrentTheme();
  const isLightTheme = useMemo(() => getCheckByTheme(theme), [theme]);

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setTheme(THEME.DARK)}>
        <img
          src={getImageUrl(darkIcon)}
          className={cn(styles.image, {
            [styles.active]: !isLightTheme,
          })}
          alt="dark theme"
        />
      </button>
      <button onClick={() => setTheme(THEME.LIGHT)}>
        <img
          src={getImageUrl(lightIcon)}
          className={cn(styles.image, {
            [styles.active]: isLightTheme,
          })}
          alt="light theme"
        />
      </button>
    </div>
  );
};

export default SwitcherTheme;
