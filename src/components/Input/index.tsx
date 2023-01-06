import { FC } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

interface Props {
  value: string;
  error?: string
  handleChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Input: FC<Props> = ({
  value, handleChange, error, placeholder, className,
}) => (
  <div className={cn(styles.wrap, className)}>
    <input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(styles.input, { [styles.withError]: error })}
      placeholder={placeholder}
    />
    {error && <div className={styles.error}>{error}</div>}
  </div>
);

Input.defaultProps = {
  error: '',
  placeholder: undefined,
  className: '',
};

export default Input;
