import { FC } from 'react';

import { INftDetails } from 'modules/analyze/Scan/interfaces';
import styles from './styles.module.scss';
import Nft from './Nft';
import NftsList from './NftsList';
import { INft } from '../../interfaces/common.interfaces';

interface Props {
  data: INftDetails[],
}

const Nfts: FC<Props> = ({ data }) => {
  const isSingle = data.length === 1;
  return (
    <div className={styles.wrap}>
      {isSingle
        ? <Nft data={data[0] as unknown as INft} />
        : <NftsList data={data} />}
    </div>
  );
};

export default Nfts;
