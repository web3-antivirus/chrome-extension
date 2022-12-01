import { FC } from 'react';
import cn from 'classnames';
import { Checkbox, CheckboxProps } from 'semantic-ui-react';
import { useTurnOnWeb3Guard } from 'hooks/use-turn-on-web3-guard';
import 'semantic-ui-css/components/checkbox.min.css';

import styles from './styles.module.scss';

const SwitcherGuard: FC<CheckboxProps> = ({ ...props }) => {
  const { isTurnOnWeb3Guard, toggleValue } = useTurnOnWeb3Guard();

  const handleChange = () => {
    toggleValue(Boolean(isTurnOnWeb3Guard));
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
