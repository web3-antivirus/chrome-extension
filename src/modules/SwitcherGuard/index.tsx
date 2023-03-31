import { FC } from 'react';
import cn from 'classnames';
import { Checkbox, CheckboxProps } from 'semantic-ui-react';
import 'semantic-ui-css/components/checkbox.min.css';
import browser from 'webextension-polyfill';

import { CHANGE_ICON_OFF, CHANGE_ICON_ON } from 'constants/chrome-send-message.constants';
import styles from './styles.module.scss';

type Props = CheckboxProps & {
  isTurnOnWeb3Guard: boolean;
  toggleValue: (value: boolean) => void;
};

const SwitcherGuard: FC<Props> = ({ isTurnOnWeb3Guard, toggleValue, ...props }) => {

  const handleChange = () => {
    toggleValue(Boolean(isTurnOnWeb3Guard));

    if (isTurnOnWeb3Guard) {
      browser.runtime.sendMessage({ message: CHANGE_ICON_OFF }).catch(() => null);
    } else {
      browser.runtime.sendMessage({ message: CHANGE_ICON_ON }).catch(() => null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Checkbox
        className={cn(styles.switcher, {
          [styles.checked]: isTurnOnWeb3Guard,
        })}
        toggle
        checked={isTurnOnWeb3Guard}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default SwitcherGuard;
