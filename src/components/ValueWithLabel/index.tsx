import { FC } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

interface Props {
  className?: string
  label: string;
  value: string;
}

const ValueWithLabel: FC<Props> = ({ className, label, value }) => (
  <div className={cn(styles.wrap, className)}>
    <div className={styles.label}>{label}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

ValueWithLabel.defaultProps = {
  className: '',
};

export default ValueWithLabel;
