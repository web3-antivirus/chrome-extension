import { FC, memo } from 'react';
import cn from 'classnames';

import pluralize from 'pluralize';
import { ArrowUpIcon } from 'constants/icons.constants';
import styles from './styles.module.scss';

interface Props {
  onClick: () => void;
  iconSrc: string;
  label?: string;
  name: string;
  className?: string;
  description?: string;
  risksCount: number | null;
}

const ContractSummary: FC<Props> = ({
  onClick, iconSrc, label, name, className, description, risksCount,
}) => (
  <button
    className={cn(styles.wrap, className)}
    onClick={onClick}
  >
    <div className={styles.info}>
      <div className={styles.main}>
        <img
          className={styles.icon}
          src={iconSrc}
          alt=""
        />
        <span className={styles.name}>{name}</span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
    <div className={styles.risksWrap}>
      {risksCount !== null && <div className={styles.count}>{risksCount} {pluralize('risk', risksCount)}</div>}
      <ArrowUpIcon classNames={styles.arrowRisk} />
    </div>
  </button>
);

ContractSummary.defaultProps = {
  label: '',
  className: '',
  description: '',
};

export default memo(ContractSummary);
