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
      chrome.runtime.sendMessage({ message: CHANGE_ICON_ON });
    } else {
      chrome.runtime.sendMessage({ message: CHANGE_ICON_OFF });
      handleSetPause(addMinutesToDate(new Date(), PAUSE_DURATION_MINUTES).toISOString());
    }
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>{pause.isPaused ? 'W3A is paused' : 'W3A is running in the background'}</h3>
      {pause.isPaused && <div className={styles.description}>Enable background monitoring to stay secure.</div>}
      <div className={styles.status}>
        <div className={styles.info}>
          <img className={styles.icon} src={getImageUrl(pause.isPaused ? turnOffIcon : turnOnIcon)} alt="" />
          Active protection
        </div>
        <div className={styles.toggle}>
          <span>{pause.isPaused ? 'PAUSED' : 'ON'}</span>
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
