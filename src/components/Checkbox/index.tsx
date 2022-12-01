import { FC, ReactNode } from 'react';
import cn from 'classnames';
import 'semantic-ui-css/components/checkbox.min.css';

import styles from './styles.module.scss';

interface Props {
  children: ReactNode
  className?: string
  classNameLabel?: string
  value?: boolean
  setValue?: (e: boolean) => void
  color?: 'green'
}

const Checkbox: FC<Props> = ({
  children, className, classNameLabel, value, setValue, color,
}) => (
  <div className={cn(styles.checkboxContainer, className)}>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label className={cn(styles.label, classNameLabel, styles[color || ''])}>
      {children}
      <input type="checkbox" checked={value} onChange={(e) => setValue && setValue(e.target.checked)} />
      <span className={styles.checkmark} />
    </label>
  </div>
);

Checkbox.defaultProps = {
  className: '',
  classNameLabel: '',
  value: false,
  setValue: undefined,
  color: 'green',
};

export default Checkbox;
