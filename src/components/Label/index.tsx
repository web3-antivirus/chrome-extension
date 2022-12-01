import { FC, memo } from 'react';
import cn from 'classnames';

import logo from 'assets/images/icons/label-logo.svg';
import { getImageUrl } from 'helpers/image.helpers';
import { THEME } from 'constants/theme.constants';

import styles from './styles.module.scss';

type Props = {
  active: boolean,
  themeFromExternalMarketPlace: string | undefined
};

const Label: FC<Props> = ({ active, themeFromExternalMarketPlace }) => (
  <button
    className={cn(
      styles.wrapper,
      {
        [styles.active]: active,
        [styles.darkThemeFromExternalMarketPlace]: themeFromExternalMarketPlace === THEME.DARK,
      },
    )}
  >
    <img src={getImageUrl(logo)} alt="" className={styles.logo} />
  </button>
);

export default memo(Label);
