import { FC } from 'react';
import cn from 'classnames';
import turnOnIcon from 'assets/images/icons/shield-turn-on.svg';
import turnOffIcon from 'assets/images/icons/shield-turn-off.svg';
import { Checkbox } from 'semantic-ui-react';

import { getImageUrl } from 'helpers/image.helpers';
import 'semantic-ui-css/components/checkbox.min.css';
import { useToggle } from 'context/toggle.context';
import { addMinutesToDate } from 'helpers/time.helpers';
import { CHANGE_ICON_OFF, CHANGE_ICON_ON } from 'constants/chrome-send-message.constants';

import browser from 'webextension-polyfill';

import styles from './styles.module.scss';
import Countdown from './Countdown';

const PAUSE_DURATION_MINUTES = 30;

const Protection: FC = () => {
  const {
    handleSetPause, handleResetPause, pause,
  } = useToggle();

  const handleChange = () => {
    if (pause.isPaused) {
      handleResetPause();
      browser.runtime.sendMessage({ message: CHANGE_ICON_ON }).catch(() => null);
    } else {
      browser.runtime.sendMessage({ message: CHANGE_ICON_OFF }).catch(() => null);
      handleSetPause(addMinutesToDate(new Date(), PAUSE_DURATION_MINUTES).toISOString());
    }
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>Protection
      </h3>
      <div className={styles.description}>{pause.isPaused
        ? 'Enable background monitoring to stay secure.' : 'W3A actively protects your browsing in the background.'}
      </div>
      <div className={styles.status}>
        <div className={styles.info}>
          <img className={styles.icon} src={getImageUrl(pause.isPaused ? turnOffIcon : turnOnIcon)} alt="" />
          Real-time protection
        </div>
        <div className={styles.toggle}>
          <Checkbox
            className={cn(styles.switcher, {
              [styles.checked]: !pause.isPaused,
            })}
            toggle
            checked={!pause.isPaused}
            onChange={() => handleChange()}
          />
        </div>
      </div>
      {pause.isPaused
      && pause.pauseUntilTime && (
        <Countdown date={pause.pauseUntilTime} onTimeEnd={handleResetPause} />
      )}
    </div>
  );
};

export default Protection;
