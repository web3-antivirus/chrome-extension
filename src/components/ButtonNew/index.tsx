import React, { ReactNode, memo } from 'react';
import cn from 'classnames';
import { Button as SUButton } from 'semantic-ui-react';
import { StrictButtonProps } from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import { BUTTON_TYPES } from 'constants/button.constants';

import styles from './styles.module.scss';

type Props = StrictButtonProps & {
  className?: string,
  buttonClassName?: string,
  children: ReactNode,
  loading?: boolean,
  styleType?: BUTTON_TYPES
  href?: string
  target?: string
}

const Button: React.FC<Props> = ({
  className, buttonClassName, loading, styleType, href, target, children, ...props
}) => (
  <div className={cn(styles.wrap, className)}>
    <SUButton
      className={cn(styles.button, buttonClassName, styles[styleType?.toLowerCase() || ''])}
      {...(href && { href })}
      {...(target && { target })}
      {...props}
    >
      {loading ? <div className={styles.loader} /> : children}
    </SUButton>
  </div>
);

Button.defaultProps = {
  className: '',
  buttonClassName: '',
  styleType: BUTTON_TYPES.PRIMARY,
  loading: false,
  href: '',
  target: '',
};

export default memo(Button);
