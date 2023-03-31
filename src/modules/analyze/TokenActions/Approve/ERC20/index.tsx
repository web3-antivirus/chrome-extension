import { FC } from 'react';

import stubIcon from 'assets/images/collection/collection-stub.svg';
import TokenImage from 'components/TokenImage';
import { getImageUrl } from 'helpers/image.helpers';

import styles from './styles.module.scss';

interface Props {
  name: string;
  imageSrc?: string;
  value: string;
}

const ERC20: FC<Props> = ({ name, imageSrc, value }) => (
  <div className={styles.wrap}>
    <div className={styles.info}>
      <TokenImage className={styles.tokenImage} src={imageSrc || getImageUrl(stubIcon)} alt={name} />
      {name}
    </div>
    <div className={styles.value}>{value}</div>
  </div>
);

ERC20.defaultProps = {
  imageSrc: '',
};

export default ERC20;
