import { useMemo, FC } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';

import Header from 'layouts/Header';
import { Screens, useScreenContext } from 'components/ScreenProvider';
import Settings from 'modules/Settings';
import Feedback from 'modules/Feedback';

import styles from './styles.module.scss';

interface Props {
  children: React.ReactNode
  onClose?: () => void
}

const Layout: FC<Props> = ({ children, onClose }) => {
  const { screen, handleSetScreen } = useScreenContext();

  const renderScreen = useMemo(() => {
    if (screen === Screens.settings) {
      return <Settings toggleSettings={() => handleSetScreen(Screens.settings)} />;
    }

    if (screen === Screens.feedback) {
      return <Feedback toggleFeedback={() => handleSetScreen(Screens.feedback)} />;
    }

    return children;
  }, [screen, handleSetScreen]);

  return createPortal(
    <div className={styles.overlay}>
      <div className={cn(styles.wrapper, 'extension-nft-check')}>
        <Header
          onClose={onClose}
          toggleSettings={() => handleSetScreen(Screens.settings)}
          toggleFeedback={() => handleSetScreen(Screens.feedback)}
        />
        {renderScreen}
      </div>
    </div>,
    document.body,
  );
};

Layout.defaultProps = {
  onClose: undefined,
};

export default Layout;
