import { useCallback, useEffect, useState } from 'react';

import {
  getValueFromSessionChromeStorage, setValueToSessionChromeStorage,
} from 'helpers/chrome-storage.helpers';
import { SESSION_WHITELIST } from 'constants/chrome-storage.constants';
import { addMinutesToDate } from 'helpers/time.helpers';
import { ExtensionUserActionType } from 'interfaces/common.interfaces';
import { sendAction } from 'services/api/actions.api';
import { useUserId } from './use-user-id';

interface WhiteList {
  [x: string]: boolean | string;
}

const WHITELIST_DURATION_MINUTES = 60;

export const useSessionWhitelist = (): [WhiteList | null, (value: string, isPermanent: boolean) => Promise<void>] => {
  const userId = useUserId();
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
    const newUrls = {
      ...(sessionWhiteList ?? {}),
      [url]: isPermanent || addMinutesToDate(new Date(), WHITELIST_DURATION_MINUTES).toISOString(),
    };
    await setValueToSessionChromeStorage(SESSION_WHITELIST, newUrls);
    setSessionWhiteList(newUrls);
    await sendAction(userId, null, ExtensionUserActionType.ProceedSuspiciousWebsite, { isPermanent }, url);
  }, [setSessionWhiteList, userId]);

  return [sessionWhiteList, setSiteToWhiteList];
};
