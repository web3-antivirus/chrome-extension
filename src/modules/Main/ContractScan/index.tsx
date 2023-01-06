import { FC, useState } from 'react';

import Input from 'components/Input';
import Button from 'components/ButtonNew';

import styles from './styles.module.scss';

const ContractScan: FC = () => {
  const [address, setAddress] = useState('');

  return (
    <div className={styles.wrap}>
      <h2>Scan a contract for risks</h2>
      <Input
        className={styles.input}
        value={address}
        handleChange={(value: string) => setAddress(value)}
        placeholder="Enter address"
      />
      <Button className={styles.btn}>Start scanning</Button>
    </div>
  );
};

export default ContractScan;
