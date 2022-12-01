import { FC, memo } from 'react';

import Logo from 'modules/Logo';
import {
  CloseIcon,
  MessageIcon,
  SettingsIcon,
} from 'constants/icons.constants';

import styles from './styles.module.scss';

type Props = {
  toggleSettings?: () => void;
  toggleFeedback?: () => void;
  isShowSettingsButton?: boolean;
  onClose?: () => void;
};

const Header: FC<Props> = ({
  toggleFeedback,
  toggleSettings,
  isShowSettingsButton,
  onClose,
}) => (
  <div className={styles.wrapper}>
    <Logo />
    <div className={styles.icons}>
      {onClose ? (
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      ) : (
        <>
          <button onClick={toggleFeedback}>
            <MessageIcon classNames={styles.feedbackIcon} />
          </button>
          {isShowSettingsButton && toggleSettings && (
            <button onClick={toggleSettings}>
              <SettingsIcon classNames={styles.settingsIcon} />
            </button>
          )}
        </>
      )}
    </div>
  </div>
);

Header.defaultProps = {
  toggleFeedback: () => null,
  toggleSettings: () => null,
  isShowSettingsButton: true,
  onClose: undefined,
};

export default memo(Header);
