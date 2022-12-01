import { FC } from 'react';

import Button from 'components/Button';

import styles from './styles.module.scss';

interface Props {
  handleDecline: () => void
  handleProceed: () => void
  withText?: boolean
}

const FooterButtons: FC<Props> = ({ withText, handleDecline, handleProceed }) => (
  <div className={styles.wrap}>
    {withText && <p className={styles.footerText}>What would you like to do?</p>}
    <div className={styles.buttons}>
      <Button onClick={handleDecline} styleType="green" className={styles.button}>
        Decline
      </Button>
      <Button
        onClick={handleProceed}
        styleType="gray"
        className={styles.button}
      >
        Proceed
      </Button>
    </div>
  </div>
);

FooterButtons.defaultProps = {
  withText: true,
};

export default FooterButtons;
