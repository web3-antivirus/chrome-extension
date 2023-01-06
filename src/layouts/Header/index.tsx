import { FC, memo } from 'react';
import cn from 'classnames';

import Logo from 'modules/Logo';
import { useToggle } from 'context/toggle.context';
import styles from './styles.module.scss';

const Header: FC = () => {
  const { pause } = useToggle();
  return (
    <div className={cn(styles.wrapper, { [styles.disabled]: pause.isPaused })}>
      <Logo />
    </div>
  );
};

export default memo(Header);
