import { FC, memo } from 'react';
import cn from 'classnames';

import alertIcon from 'assets/images/icons/alert.svg';
import checkIcon from 'assets/images/icons/check-circle.svg';
import { getImageUrl } from 'helpers/image.helpers';
import styles from './styles.module.scss';

type Props = {
  title: string;
  description: string;
  hasRisk: boolean;
  classNames?: string,
};

const RiskBlock: FC<Props> = ({
  description,
  title,
  hasRisk,
  classNames,
}) => (
  <div className={cn(styles.wrapper, classNames)}>
    <div className={styles.titleWrapper}>
      <img src={getImageUrl(hasRisk ? alertIcon : checkIcon)} alt="" className={styles.icon} />
      <p className={styles.title}>{title}</p>
    </div>
    <p className={styles.description}>{description}</p>
  </div>
);

RiskBlock.defaultProps = {
  classNames: '',
};

export default memo(RiskBlock);
