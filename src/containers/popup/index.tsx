import { FC, useMemo } from 'react';
import Header from 'layouts/Header';
import Settings from 'modules/Settings';
import Feedback from 'modules/Feedback';
import { Screens, useScreenContext } from 'components/ScreenProvider';
import styles from './styles.module.scss';

const Popup: FC = () => {
  const { screen, handleSetScreen } = useScreenContext();

  const renderScreen = useMemo(() => {
    switch (screen) {
      case Screens.feedback:
        return <Feedback toggleFeedback={() => handleSetScreen(Screens.feedback)} />;
      case Screens.settings:
        return <Settings isShowButton={false} />;
      default:
        return <Settings isShowButton={false} />;
    }
  }, [screen]);

  return (
    <>
      <Header
        toggleSettings={() => handleSetScreen(Screens.settings)}
        toggleFeedback={() => handleSetScreen(Screens.feedback)}
        isShowSettingsButton
      />
      <div className={styles.wrapper}>
        {renderScreen}
      </div>
    </>
  );
};

export default Popup;
