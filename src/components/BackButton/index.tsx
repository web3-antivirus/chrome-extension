import { FC } from 'react';
import cn from 'classnames';
import { ArrowUpIcon } from 'constants/icons.constants';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  onClick: () => void
  text?: string;
}
const BackButton: FC<Props> = ({ className, onClick, text }) => (
  <button className={cn(styles.wrap, className)} onClick={onClick}><ArrowUpIcon classNames={styles.icon} /><span>{text}</span></button>
);

BackButton.defaultProps = {
  className: '',
  text: 'Go back',
};

export default BackButton;
