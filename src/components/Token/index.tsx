import { FC } from 'react';
import cn from 'classnames';

import { getImageUrl } from 'helpers/image.helpers';
import stubIcon from 'assets/images/collection/collection-stub.svg';
import TokenImage from 'components/TokenImage';

import styles from './styles.module.scss';

interface Props {
  name: string
  image?: string
  icon?: string
  link?: string;
  isRounded?: boolean
}

const Token: FC<Props> = ({
  name, image, icon, link, isRounded,
}) => (
  <div className={styles.wrap}>
    <TokenImage
      className={cn(styles.image, { [styles.isRounded]: isRounded })}
      src={image || getImageUrl(stubIcon)}
      alt={name}
      stub={stubIcon}
    />
    <div className={styles.nameWrap}>
      {link
        ? (
          <a href={link} target="_blank" rel="noreferrer">
            <h1 className={styles.name}>{name}</h1>
          </a>
        ) : <h1 className={styles.name}>{name}</h1>}
      {icon && <img className={styles.icon} src={icon} alt="" />}
    </div>
  </div>
);

Token.defaultProps = {
  image: '',
  icon: '',
  link: '',
  isRounded: false,
};

export default Token;
