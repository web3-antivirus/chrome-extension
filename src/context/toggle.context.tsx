import {
  useState, useEffect, useCallback, createContext, useContext, FC,
} from 'react';
import { getValueToChromeStorage, setValueToChromeStorage, subscribeChangesChromeStorage } from 'helpers/chrome-storage.helpers';
import { STORAGE_IS_PAUSED } from 'constants/chrome-storage.constants';

type TPause = {
  isPaused: boolean;
  pauseUntilTime: string | null;
}
type TReturnUseToggle = {
  pause: TPause,
  handleSetPause: (date: string) => void,
  handleResetPause: () => void,
}

const DEFAULT_VALUE: TPause = { isPaused: false, pauseUntilTime: null };

export const ToggleContext = createContext<TReturnUseToggle>({
  pause: DEFAULT_VALUE,
  handleSetPause: () => null,
  handleResetPause: () => null,
});

export const useToggle = (): TReturnUseToggle => useContext(ToggleContext);

interface Props {
  children: JSX.Element | JSX.Element[]
}

const ToggleProvider: FC<Props> = ({ children }) => {
  const [pause, setPause] = useState<TPause>(DEFAULT_VALUE);

  useEffect(() => {
    getValueToChromeStorage(STORAGE_IS_PAUSED, (value: TPause) => {
      if (!value) {
        setValueToChromeStorage(STORAGE_IS_PAUSED, DEFAULT_VALUE);
      }
      setPause(value || DEFAULT_VALUE);
    });
  }, []);

  subscribeChangesChromeStorage(STORAGE_IS_PAUSED, (value: TPause) => {
    setPause(value);
  });

  const handleSetPause = useCallback(
    (date: string) => {
      const newPause: TPause = { isPaused: true, pauseUntilTime: date };
      setPause(newPause);
      setValueToChromeStorage(STORAGE_IS_PAUSED, newPause);
    },
    [setPause],
  );

  const handleResetPause = useCallback(
    () => {
      setPause(DEFAULT_VALUE);
    },
    [setPause],
  );

  return (
    <ToggleContext.Provider value={{
      pause,
      handleSetPause,
      handleResetPause,
    }}
    >
      {children}
    </ToggleContext.Provider>
  );
};

export default ToggleProvider;
