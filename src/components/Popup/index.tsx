import { FC, memo } from 'react';
import { Popup as SPopup, StrictPopupProps } from 'semantic-ui-react';
import cn from 'classnames';
import 'semantic-ui-css/components/popup.min.css';

import { getShadowRoot } from 'helpers/common.helpers';
import styles from './styles.module.scss';

type Props = StrictPopupProps & {
  styleType?: 'white' | 'diff' | 'tooltip'
  className?: string
  position?: string
}

const Popup: FC<Props> = ({
  styleType = 'white', className, position, ...props
}) => {
  const root = getShadowRoot();

  return (
    <SPopup
      className={cn(styles[styleType], className)}
      mountNode={root || document.body}
      position={position}
      {...props}
      {...{ style: { zIndex: 99999999999999999999 } }}
    />
  );
};

Popup.defaultProps = {
  className: '',
  styleType: 'white',
  position: 'bottom center',
};

export default memo(Popup);
