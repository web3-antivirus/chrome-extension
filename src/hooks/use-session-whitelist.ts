import { useCallback, useEffect, useState } from 'react';

import {
  getValueFromSessionChromeStorage, setValueToSessionChromeStorage,
} from 'helpers/chrome-storage.helpers';
import { SESSION_WHITELIST } from 'constants/chrome-storage.constants';

interface WhiteList {
  [x: string]: boolean
}

export const useSessionWhitelist = (): [WhiteList | null, (value: string, isPermanent: boolean) => Promise<void>] => {
  const [sessionWhiteList, setSessionWhiteList] = useState<WhiteList | null>(null);

  useEffect(() => {
    const getInitialData = async () => {
      const urls = await getValueFromSessionChromeStorage<WhiteList | null>(SESSION_WHITELIST);
      if (!urls) {
        await setValueToSessionChromeStorage(SESSION_WHITELIST, {});
        setSessionWhiteList({});
        return;
      }

      setSessionWhiteList(urls);
    };
    getInitialData().catch(() => null);

  }, [setSessionWhiteList]);

  const setSiteToWhiteList = useCallback(async (url: string, isPermanent: boolean) => {
    const newUrls = { ...(sessionWhiteList ?? {}), [url]: isPermanent };
    await setValueToSessionChromeStorage(SESSION_WHITELIST, newUrls);
    setSessionWhiteList(newUrls);
  }, [setSessionWhiteList]);

  return [sessionWhiteList, setSiteToWhiteList];
};
