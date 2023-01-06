import { useState, useEffect } from 'react';
import { getValueToChromeStorage, setValueToChromeStorage, subscribeChangesChromeStorage } from 'helpers/chrome-storage.helpers';
import { STORAGE_WHITELIST_FOR_WEB3_GUARD } from 'constants/chrome-storage.constants';
import { DEFAULT_WHITE_LIST_FOR_WEB3_GUARD } from 'constants/web3-guard.constants';

type TReturnUseWhitelistWeb3Guard = {
  whiteList: string[] | undefined,
  setWhiteListValue: (value: string[]) => void,
  removeWhiteListValue: (value: string) => void
}

export const useWhitelistWeb3Guard = (): TReturnUseWhitelistWeb3Guard => {
  const [whiteList, setWhiteList] = useState<string[] | undefined>(DEFAULT_WHITE_LIST_FOR_WEB3_GUARD);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getValueToChromeStorage(STORAGE_WHITELIST_FOR_WEB3_GUARD, (value: string[] | []) => {
      setWhiteList(value);
      setIsLoading(false);
    }, DEFAULT_WHITE_LIST_FOR_WEB3_GUARD);
  }, []);

  subscribeChangesChromeStorage(STORAGE_WHITELIST_FOR_WEB3_GUARD, (value: string[] | []) => {
    setWhiteList(value);
  });

  const setWhiteListValue = (newValue: string[]) => {
    setValueToChromeStorage(STORAGE_WHITELIST_FOR_WEB3_GUARD, newValue);
  };

  const removeWhiteListValue = (value: string) => {
    const newValue = whiteList?.filter((item) => item !== value);
    setValueToChromeStorage(STORAGE_WHITELIST_FOR_WEB3_GUARD, newValue);
  };

  return {
    whiteList: isLoading ? undefined : whiteList,
    setWhiteListValue,
    removeWhiteListValue,
  };
};
