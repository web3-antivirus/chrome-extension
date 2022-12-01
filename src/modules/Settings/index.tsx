import { FC, memo } from 'react';
import cn from 'classnames';

import Button from 'components/Button';
import SwitcherGuard from 'modules/SwitcherGuard';
import { getCodeExecutionEnvironment } from 'helpers/environments.helpers';
import SwitcherTheme from 'modules/SwitcherTheme';

import styles from './styles.module.scss';

type Props = {
  toggleSettings?: () => void
  isShowButton?: boolean
};

const Settings: FC<Props> = ({ toggleSettings, isShowButton }) => {
  const { isPopUp } = getCodeExecutionEnvironment();

  return (
    <div className={cn(styles.wrapper, { [styles.scroll]: isPopUp })}>
      <p className={styles.title}>Settings</p>
      <div className={styles.guard}>
        <p>Web3 Guard</p>
        <div>
          <SwitcherGuard />
        </div>
      </div>
      <div className={styles.appearance}>
        <p className={styles.themeTitle}>Theme</p>
        <SwitcherTheme />
      </div>
      {isShowButton && toggleSettings && (
        <div className={styles.buttonWrapper}>
          <Button onClick={toggleSettings} styleType="green" buttonClassName={styles.button}>
            Done
          </Button>
        </div>
      )}
    </div>
  );
};

Settings.defaultProps = {
  toggleSettings: () => null,
  isShowButton: true,
};

export default memo(Settings);
