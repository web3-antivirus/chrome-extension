import * as Sentry from '@sentry/browser';

import {
  EXTENSION_INITIALIZE_PATH,
  API_PROD_PATH,
} from '../../constants/check-nft.constants';
import {
  STORAGE_USER_ID,
  STORAGE_TOKEN,
} from '../../constants/chrome-storage.constants';
import { getRandomToken } from '../../helpers/token.helpers';

import { setStorageValue, getSyncStorageValue, setSyncStorageValue } from './common';

const isDevelopment = process.env.NODE_ENV === 'development';

export const updateToken = async (
  userId: string, utm: chrome.cookies.Cookie | null = null, ga4: chrome.cookies.Cookie | null = null,
): Promise<void> => {
  const result = await fetch(`${API_PROD_PATH}${EXTENSION_INITIALIZE_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      utm: utm ? utm.value : undefined,
      cid: ga4 ? ga4.value.slice(6) : undefined,
      id: userId,
      dev: isDevelopment,
    }),
  });

  const { token } = await result.json();
  await setStorageValue(STORAGE_TOKEN, token);
};

export const updateUserToken = async (): Promise<void> => {
  let userId = await getSyncStorageValue(STORAGE_USER_ID);

  if (!userId) {
    userId = getRandomToken();
    await setSyncStorageValue(STORAGE_USER_ID, userId);
  }

  try {
    await updateToken(userId);
  } catch (error) {
    Sentry.captureException(error);
  }
};
