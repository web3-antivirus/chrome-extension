import { FC } from 'react';

import Button from 'components/Button';
import styles from './styles.module.scss';

type Props = {
  handleSubmit: () => void
}

const NoContractData: FC<Props> = ({ handleSubmit }) => (
  <div className={styles.wrap}>
    <div className={styles.message}>
      <div className={styles.text}>
        Heads up! You will not be able to complete the transaction due to insufficient funds or unavailable assets in your wallet.
      </div>
      <Button
        onClick={handleSubmit}
        styleType="gray"
        buttonClassName={styles.button}
      >
        Open Metamask
      </Button>
    </div>
  </div>
);

export default NoContractData;
