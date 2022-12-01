import { FC, memo, ReactNode } from 'react';
import cn from 'classnames';
import { Loader, LoaderProps } from 'semantic-ui-react';

import 'semantic-ui-css/components/loader.min.css';

import styles from './styles.module.scss';

type Props = LoaderProps & {
  children?: ReactNode,
};

const Loading: FC<Props> = ({ className, children, ...props }) => (
  <div className={cn(styles.wrapper, className)}>
    <Loader {...props}>
      {children}
    </Loader>
  </div>
);

Loading.defaultProps = {
  children: '',
};

export default memo(Loading);
