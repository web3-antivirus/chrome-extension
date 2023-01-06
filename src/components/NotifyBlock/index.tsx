import { getImageUrl } from 'helpers/image.helpers';
import { FC, memo } from 'react';
import styles from './styles.module.scss';

type Props = {
  src: string,
  title: string,
  description?: string,
  alt?: string,
  classNameIcon?: string,
};

const NotifyBlock: FC<Props> = ({
  title, src, alt, classNameIcon, description,
}) => (
  <div className={styles.wrapper}>
    <img src={getImageUrl(src)} alt={alt} className={classNameIcon} />
    <div className={styles.textWrap}>
      {description && <p className={styles.description}>{description}</p>}
      <p className={styles.title}>{title}</p>
    </div>
  </div>
);

NotifyBlock.defaultProps = {
  alt: '',
  classNameIcon: '',
  description: '',
};

export default memo(NotifyBlock);
