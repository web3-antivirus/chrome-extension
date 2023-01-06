import { useState, useEffect } from 'react';
import { getValueToChromeStorage, setValueToChromeStorage, subscribeChangesChromeStorage } from 'helpers/chrome-storage.helpers';
import { STORAGE_IS_TURN_ON_WEB3_GUARD } from 'constants/chrome-storage.constants';

type TValue = {
  isTurnOn: boolean | undefined
}
type TReturnUseTurnOnWeb3Guard = {
  isTurnOnWeb3Guard: TValue['isTurnOn'],
  toggleValue: (value: boolean) => void,
  turnOnWeb3Guard: () => void,
  turnOffWeb3Guard: () => void,
}

const DEFAULT_VALUE = { isTurnOn: true };

export const useTurnOnWeb3Guard = (): TReturnUseTurnOnWeb3Guard => {
  const [isTurnOnWeb3Guard, setIsTurnOnWeb3Guard] = useState<TValue>(DEFAULT_VALUE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getValueToChromeStorage(STORAGE_IS_TURN_ON_WEB3_GUARD, (value: TValue) => {
      if (!value) {
        setValueToChromeStorage(STORAGE_IS_TURN_ON_WEB3_GUARD, DEFAULT_VALUE);
      }
      setIsTurnOnWeb3Guard(value || DEFAULT_VALUE);
      setIsLoading(false);
    });
  }, []);

  subscribeChangesChromeStorage(STORAGE_IS_TURN_ON_WEB3_GUARD, (value: TValue) => {
    setIsTurnOnWeb3Guard(value);
  });

  return {
    isTurnOnWeb3Guard: isLoading ? undefined : isTurnOnWeb3Guard?.isTurnOn,
    toggleValue: (value: boolean) => setValueToChromeStorage(STORAGE_IS_TURN_ON_WEB3_GUARD, { isTurnOn: !value }),
    turnOnWeb3Guard: () => setValueToChromeStorage(STORAGE_IS_TURN_ON_WEB3_GUARD, { isTurnOn: true }),
    turnOffWeb3Guard: () => setValueToChromeStorage(STORAGE_IS_TURN_ON_WEB3_GUARD, { isTurnOn: false }),
  };
};
