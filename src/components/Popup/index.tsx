import { FC, memo } from 'react';
import { Popup as SPopup, StrictPopupProps } from 'semantic-ui-react';
import cn from 'classnames';
import 'semantic-ui-css/components/popup.min.css';

import styles from './styles.module.scss';

type Props = StrictPopupProps & {
  styleType: 'white' | 'diff' | 'tooltip'
  className?: string
}

const Popup: FC<Props> = ({ styleType, className, ...props }) => (
  <SPopup className={cn(styles[styleType], className)} {...props} {...{ style: { zIndex: 99999999999999999999 } }} />
);

Popup.defaultProps = {
  className: '',
};

export default memo(Popup);
