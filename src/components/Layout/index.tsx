import Header from 'layouts/Header';
import { useMemo, FC } from 'react';
import cn from 'classnames';
import { createPortal } from 'react-dom';
import { useScreenContext } from 'components/ScreenProvider';
import { getShadowRoot } from 'helpers/common.helpers';
import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode,
  headerChild?: React.ReactNode,
}

const Layout: FC<Props> = ({ children, headerChild }) => {
  const { screen, handleSetScreen } = useScreenContext();
  const root = getShadowRoot();

  const renderScreen = useMemo(() => children, [screen, handleSetScreen]);

  return createPortal(
    <div className={styles.overlay}>
      <div className={cn(styles.wrapper, 'light-ext', 'web3-antivirus')}>
        {headerChild || <Header />}
        {renderScreen}
      </div>
    </div>,
    root || document.body,
  );
};

Layout.defaultProps = {
  headerChild: undefined,
};

export default Layout;
