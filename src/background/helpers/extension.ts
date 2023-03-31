import { BROWSER, IS_DEVELOPMENT } from '../constants';
import {
  STORAGE_INSTALL_CHECKED,
  STORAGE_WHITELIST_FOR_WEB3_GUARD,
  STORAGE_USER_ID,
} from '../../constants/chrome-storage.constants';
import { LANDING_URL } from '../../constants/url.constants';
import { getRandomToken } from '../../helpers/token.helpers';
import { updateUserToken, updateToken } from './token';
import {
  updateIcon,
  checkExtensionsMalicious,
  registerScripts,
  setUninstallUrl,
} from './browser';
import { getW3AWhiteList } from '../api/index';

import {
  setStorageValue,
  getSyncStorageValue,
  setSyncStorageValue,
  getCookieValue,
  getStorageValue,
} from './common';
import { WHITE_LIST_LAST_TIME_CHECKED_DATE } from '../constants/storage.constants';
import { getHoursDiffBetweenTwoDates } from './date.helpers';

export const updateWhitelist = async (): Promise<void> => {
  const list = await getW3AWhiteList();
  // check for empty, add protocol for urls
  await setStorageValue(
    STORAGE_WHITELIST_FOR_WEB3_GUARD,
    (list || [])
      .filter((url: string) => url)
      .map((url: string) => `https://${url}`),
  );

  setStorageValue(WHITE_LIST_LAST_TIME_CHECKED_DATE, new Date().toISOString());
};

const initExtension = async () => {
  let userId = await getSyncStorageValue(STORAGE_USER_ID);
  if (!userId) {
    userId = getRandomToken();
    await setSyncStorageValue(STORAGE_USER_ID, userId);
  }

  const [utm, ga4] = await Promise.all([
    getCookieValue(LANDING_URL, 'utm'),
    getCookieValue(LANDING_URL, '_ga'),
    updateWhitelist(),
  ]);

  await updateToken(userId, utm, ga4);
};

export const handleUpdate = async (): Promise<void> => {
  const [isChecked] = await Promise.all([
    getStorageValue(STORAGE_INSTALL_CHECKED),
    updateIcon(),
  ]);

  if (BROWSER !== 'firefox') {
    await registerScripts();
  }

  if (!isChecked) {
    await initExtension();
    await setStorageValue(STORAGE_INSTALL_CHECKED, true);
    checkExtensionsMalicious();
  } else {
    await updateUserToken();
  }

  if (!IS_DEVELOPMENT) {
    setUninstallUrl();
  }
};

const WHITE_LIST_UPDATE_PERIOD_HOURS = 24;
export const whiteListUpdateCheck = async (): Promise<void> => {
  const lastTimeCheckedDate = await getStorageValue<string>(
    WHITE_LIST_LAST_TIME_CHECKED_DATE,
  );

  if (lastTimeCheckedDate) {
    const hoursDiff = getHoursDiffBetweenTwoDates(
      new Date(lastTimeCheckedDate),
      new Date(),
    );

    if (hoursDiff >= WHITE_LIST_UPDATE_PERIOD_HOURS) {
      await updateWhitelist();
    }
  } else {
    await updateWhitelist();
  }
};
