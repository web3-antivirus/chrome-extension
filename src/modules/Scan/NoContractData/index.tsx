import { FC } from 'react';
import ButtonNew from 'components/ButtonNew';
import { BUTTON_TYPES } from 'constants/button.constants';

import styles from './styles.module.scss';

type Props = {
  handleSubmit: () => void
}

const NoContractData: FC<Props> = ({ handleSubmit }) => (
  <div className={styles.wrap}>
    <div className={styles.message}>
      <div className={styles.text}>
        <p className={styles.title}>Heads up!</p>
        You will not be able to complete the transaction due to insufficient funds or unavailable assets in your wallet.
      </div>
      <ButtonNew
        onClick={handleSubmit}
        styleType={BUTTON_TYPES.PRIMARY}
        className={styles.button}
      >
        Open Metamask
      </ButtonNew>
    </div>
  </div>
);

export default NoContractData;
