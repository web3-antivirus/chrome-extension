import { FC, memo } from 'react';
import movePromptIcon from 'assets/images/tracing/move-prompt.svg';
import horizontalScrollPromptIcon from 'assets/images/tracing/horizontal-scroll-prompt.svg';
import hoverPromptIcon from 'assets/images/tracing/hover-prompt.svg';
import { ReactComponent as CloseIcon } from 'assets/images/tracing/close-icon.svg';
import styles from './styles.module.scss';

type Props = {
  handleClose: () => void
};

const PromptBlock: FC<Props> = ({ handleClose }) => (

  <div className={styles.promptContainer}>
    <div className={styles.prompts}>
      <div className={styles.prompt}>
        <img src={movePromptIcon} alt="move prompt icon" />
        <p>Click the left button and drag to move around</p>
      </div>
      <div className={styles.prompt}>
        <img src={horizontalScrollPromptIcon} alt="horizontal scroll prompt icon" />
        <p>Click Shift button and scroll to move horizontally</p>
      </div>
      <div className={styles.prompt}>
        <img src={hoverPromptIcon} alt="hover prompt icon" />
        <p>Click on a method to view detailed information</p>
      </div>
    </div>
    <button className={styles.closeButton} onClick={handleClose}>
      <CloseIcon />
    </button>
  </div>
);

export default memo(PromptBlock);
