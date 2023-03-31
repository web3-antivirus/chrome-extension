/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-restricted-syntax */
import browser from 'webextension-polyfill';
import { sendUserAction } from '../api';
import { ExtensionUserActionType } from '../../interfaces/common.interfaces';
import {
  STORAGE_IS_PAUSED,
  STORAGE_TOKEN,
  STORAGE_USER_ID,
} from '../../constants/chrome-storage.constants';
import {
  CHANGE_URL,
  ERROR_POPUP,
  URL_STATUSES,
} from '../../constants/background.constants';
import { NOTIFICATION_ERROR_TYPES } from '../../constants/error.constants';

import {
  DEFAULT_PAUSE_VALUE,
  METAMASK_ORIGINAL_DATA,
  TURN_OFF_ICONS,
} from '../constants/index';
import {
  getStorageValue, getSyncStorageValue, setBrowserIcon, setStorageValue,
} from './common';

export const registerScripts = async (): Promise<void> => {
  // execute only in chrome
  await chrome.scripting.unregisterContentScripts();
  await chrome.scripting.registerContentScripts([
    {
      id: 'w3a script',
      matches: ['http://*/*', 'https://*/*'],
      js: ['/script/main.js'],
      allFrames: true,
      runAt: 'document_start',
      world: 'MAIN',
    },
  ]);
};

export const updateIcon = async (): Promise<void> => {
  const value = await getStorageValue(STORAGE_IS_PAUSED);
  if (value && value.isPaused) {
    if (value.pauseUntilTime && new Date(value.pauseUntilTime) > new Date()) {
      setBrowserIcon(TURN_OFF_ICONS);
      browser.alarms.create('pause', {
        when: new Date(value.pauseUntilTime).getTime(),
      });
    } else {
      await setStorageValue(STORAGE_IS_PAUSED, DEFAULT_PAUSE_VALUE);
    }
  }
};

// check metamask extension for malicious
export const handleSuspiciousMetamask = async (
  extensionInfo: browser.Management.ExtensionInfo,
  errorType: string,
): Promise<void> => {

  await browser.management.setEnabled(extensionInfo.id, false);
  const tab = await browser.tabs.query({ active: true, currentWindow: true });
  const tabId = tab[0].id;

  sendUserAction(
    ExtensionUserActionType.PhishingMetamaskDetected,
    null,
    tab[0].url,
  ).catch(() => null);
  await browser.tabs.sendMessage(Number(tabId), {
    type: errorType,
    message: NOTIFICATION_ERROR_TYPES.MALICIOUS_METAMASK,
    tab: tab[0],
  }).catch(() => null);
  // https://stackoverflow.com/a/69587523
  if (!browser.runtime.lastError) {
    console.log('');
  } else {
    console.log('error in sendMessage');
  }
};

// Note: checking after w3a install
export const checkExtensionsMalicious = async (): Promise<void> => {
  const extensions = await browser.management.getAll();
  const metamaskExt = extensions.find(
    (ext) => ext.shortName === METAMASK_ORIGINAL_DATA.shortName,
  );

  if (metamaskExt && metamaskExt.id !== METAMASK_ORIGINAL_DATA.id) {
    await handleSuspiciousMetamask(metamaskExt, ERROR_POPUP);
  }
};

export const redirectToPhishing = async (
  nearestURL: string,
  siteName: string,
): Promise<void> => {
  await browser.tabs.update({
    url: `${browser.runtime.getURL('phishing.html')}?${
      nearestURL ? `safeUrl=${String(nearestURL)}` : ''
    }&originalUrl=${encodeURIComponent(siteName)}`,
  });
};

export const executeScripts = async (): Promise<void> => {
  // @ts-ignore
  for (const cs of browser.runtime.getManifest().content_scripts) {
    for (const tab of await browser.tabs.query({ url: cs.matches })) {
      await browser.scripting.executeScript({
        target: { tabId: Number(tab.id) },
        files: cs.js as string[],
      });

      browser.runtime.lastError;
      await browser.scripting.insertCSS({
        target: { tabId: Number(tab.id) },
        files: cs.css,
      });
      browser.runtime.lastError;
    }
  }
};

export const handleUrlChange = async (
  tabId: number,
  changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
  tab: browser.Tabs.Tab,
): Promise<void> => {
  const token = await getStorageValue(STORAGE_TOKEN);
  if (token && changeInfo.status === URL_STATUSES.complete) {
    browser.tabs.sendMessage(tabId, { message: CHANGE_URL, tab }).catch(() => null);
    browser.runtime.lastError;
  }
};

export const setUninstallUrl = async (): Promise<void> => {
  const userId = await getSyncStorageValue(STORAGE_USER_ID);
  await browser.runtime.setUninstallURL(process.env.UNINSTALL_URL.replace('[userId]', userId));
};
