import { FC } from 'react';

import { getImageUrl } from 'helpers/image.helpers';
import stubIcon from 'assets/images/collection/collection-stub.svg';

import styles from './styles.module.scss';

interface Props {
  name: string
  image?: string
}

const Token: FC<Props> = ({
  name, image,
}) => (
  <div className={styles.item}>
    <img
      className={styles.image}
      src={getImageUrl(image || stubIcon)}
      alt={name}
    />
    <span className={styles.name}>{name}</span>
  </div>
);

Token.defaultProps = {
  image: '',
};

export default Token;
