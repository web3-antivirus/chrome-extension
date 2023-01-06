import { FC } from 'react';
import cn from 'classnames';
import ButtonNew from 'components/ButtonNew';
import { BUTTON_TYPES } from 'constants/button.constants';

import styles from './styles.module.scss';

interface Props {
  handleDecline: () => void
  handleProceed: () => void
  text?: string
  className?: string
}

const FooterButtons: FC<Props> = ({
  text, handleDecline, handleProceed, className,
}) => (
  <div className={cn(styles.wrap, className)}>
    {text && <h1 className={styles.footerText}>{text}</h1>}
    <div className={styles.buttons}>
      <ButtonNew
        onClick={handleDecline}
        styleType={BUTTON_TYPES.SECONDARY}
        className={styles.button}
      >
        Block
      </ButtonNew>
      <ButtonNew
        onClick={handleProceed}
        styleType={BUTTON_TYPES.PRIMARY}
        className={styles.button}
      >
        Continue
      </ButtonNew>
    </div>
  </div>
);

FooterButtons.defaultProps = {
  text: '',
  className: '',
};

export default FooterButtons;
