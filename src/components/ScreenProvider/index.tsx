import { STORAGE_TOKEN } from 'constants/chrome-storage.constants';
import { getValueToChromeStorage } from 'helpers/chrome-storage.helpers';
import {
  createContext, useContext,
  useState, FC, PropsWithChildren, useCallback, useEffect,
} from 'react';

export enum Screens {
  default = 'default',
  settings = 'settings',
  feedback = 'feedback',
  enter = 'enter',
}

export type Screen = Screens;

export type ScreenContent = {
  screen: Screen;
  handleSetScreen: (value: Screen) => void;
}

export const ScreenContext = createContext<ScreenContent>({
  screen: Screens.default,
  handleSetScreen: () => { /**/ },
});

export const useScreenContext = () => useContext(ScreenContext);

export const ScreenProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>(Screens.default);

  useEffect(() => {
    getValueToChromeStorage(STORAGE_TOKEN, (value) => {
      if (value) {
        setScreen(Screens.default);
      }
    });

  }, [setScreen]);

  const handleSetScreen = useCallback((nextScreen: Screens) => {
    setScreen(screen === nextScreen ? Screens.default : nextScreen);
  }, [screen]);

  return (
    <ScreenContext.Provider value={{ screen, handleSetScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};
