import { FC, memo } from 'react';

import Header from 'layouts/Header';
import Main from 'modules/Main';
import { Screens, useScreenContext } from 'components/ScreenProvider';
import Footer from 'layouts/Footer';

import styles from './styles.module.scss';

const Popup: FC = () => {
  const { screen } = useScreenContext();

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Main />
      </div>
      {screen !== Screens.enter && <Footer />}
    </>
  );
};

export default memo(Popup);
