/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { getSyncStorageValue } from '../helpers/common';
import { STORAGE_USER_ID } from '../../constants/chrome-storage.constants';
import { ExtensionUserActionType } from '../../interfaces/common.interfaces';
import {
  URL_WHITE_LIST,
  URL_ANALYZE_API,
  EXTENSION_ACTION_API,
} from '../../constants/check-nft.constants';

export const getUrlAnalyze = async (siteName: string) => {
  const result = await fetch(
    `${URL_ANALYZE_API}?${
      new URLSearchParams({
        url: siteName,
      })}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  );
  const { status, payload } = await result.json();
  return { status, payload };
};

export const getW3AWhiteList = async () => {
  const result = await fetch(`${URL_WHITE_LIST}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  const list: string[] = await result.json();
  return list;
};

export const sendUserAction = async (
  actionType: ExtensionUserActionType, actionValue: Record<string, string> | null, websiteURL = '',
): Promise<void> => {
  const userId = await getSyncStorageValue(STORAGE_USER_ID);

  fetch(EXTENSION_ACTION_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      userId,
      actionType,
      actionValue,
      websiteURL,
    }),
  });
};
