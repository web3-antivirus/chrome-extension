/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/await-thenable */
import browser from 'webextension-polyfill';
import { BROWSER } from '../constants';

export const getStorageValue = async <T = any>(key: string, defaultValue: any = null): Promise<T> => {
  const result = await browser.storage.local.get(key);
  const value = (result as unknown as { [key: string]: any })[key] || defaultValue;
  return value;
};

export const setStorageValue = (key: string, value: any): Promise<void> => browser.storage.local
  .set({ [key]: value })
  .then()
  .catch((e) => console.log(e));

export const getSyncStorageValue = async <T = any>(key: string, defaultValue = null): Promise<T> => {
  const result = await browser.storage.sync.get(key);
  const value = (result as unknown as { [key: string]: any })[key] || defaultValue;
  return value;
};

export const setSyncStorageValue = (key: string, value: any): Promise<void> => browser.storage.sync
  .set({ [key]: value })
  .then()
  .catch((e) => console.log(e));

export const getCookieValue = (url: string, name: string) => browser.cookies.get({ url, name });

export const getSiteName = (url: string): string => {
  if (url) {
    return new URL(url)?.origin;
  }

  return '';
};

export const setBrowserIcon = (data: browser.Action.SetIconDetailsType): void => {
  if (BROWSER === 'firefox') {
    browser.browserAction.setIcon(data);
  } else {
    browser.action.setIcon(data);
  }
};
