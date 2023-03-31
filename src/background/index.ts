/* eslint-disable no-unused-expressions */
import * as Sentry from '@sentry/browser';
import browser from 'webextension-polyfill';
import { ERROR_NOTIFICATION } from '../constants/background.constants';
import {
  STORAGE_IS_PAUSED,
} from '../constants/chrome-storage.constants';
import {
  OPEN_TRACING_DIAGRAM_PAGE,
  REQUEST_OPEN_TRACING_DIAGRAM_PAGE,
  CHANGE_ICON_OFF,
  CHANGE_ICON_ON,
} from '../constants/chrome-send-message.constants';
import {
  TURN_ON_ICONS,
  TURN_OFF_ICONS,
  METAMASK_ORIGINAL_DATA,
  DEFAULT_PAUSE_VALUE,
  IS_DEVELOPMENT,
} from './constants/index';
import { setBrowserIcon, setStorageValue } from './helpers/common';

import {
  updateIcon,
  handleSuspiciousMetamask,
  executeScripts,
  handleUrlChange,
} from './helpers/browser';
import { handleUpdate, whiteListUpdateCheck } from './helpers/extension';
import { handleUrlCheck } from './helpers/url-checker';

const { SENTRY_URL } = process.env;
Sentry.init({
  dsn: IS_DEVELOPMENT ? '' : SENTRY_URL,
});

browser.storage.local.set({ session: {} });

// check initial icon on browser load
updateIcon().catch(() => null);

browser.alarms.create('whiteListCheck', { periodInMinutes: 1 });

browser.management.onInstalled.addListener((extensionInfo) => {
  if (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    extensionInfo.reason === 'install'
    && extensionInfo.shortName === METAMASK_ORIGINAL_DATA.shortName
    && extensionInfo.id !== METAMASK_ORIGINAL_DATA.id
  ) {
    handleSuspiciousMetamask(extensionInfo, ERROR_NOTIFICATION).catch(() => null);
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleUrlChange(tabId, changeInfo, tab).catch(() => null);
});

browser.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  handleUrlCheck(tab, changeInfo).catch((e) => console.log(e));
});

browser.runtime.onInstalled.addListener(() => {
  handleUpdate().catch((e) => console.log(e));
  executeScripts().catch((e) => console.log(e));
});

browser.runtime.onMessage.addListener((request) => {
  if (request.message === CHANGE_ICON_ON) {
    setBrowserIcon(TURN_ON_ICONS);
  }

  if (request.message === CHANGE_ICON_OFF) {
    setBrowserIcon(TURN_OFF_ICONS);
  }
});

browser.runtime.onMessage.addListener(async (request) => {
  if (request.message === REQUEST_OPEN_TRACING_DIAGRAM_PAGE) {
    const sendMessage = {
      message: OPEN_TRACING_DIAGRAM_PAGE,
      trace: request.trace,
    };
    const tab = await browser.tabs.create(
      { url: browser.runtime.getURL('tracing.html') },
    );
    const handler = (tabId: number, changeInfo: browser.Tabs.OnUpdatedChangeInfoType) => {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        browser.tabs.onUpdated.removeListener(handler);
        browser.tabs.sendMessage(
          tabId,
          sendMessage,
        ).catch(() => null);
        browser.runtime.lastError;
      }
    };
    // in case we're faster than page load (usually):
    browser.tabs.onUpdated.addListener(handler);
    // just in case we're too late with the listener:
    await browser.tabs.sendMessage(
      Number(tab.id),
      sendMessage,
    ).catch(() => null);
    browser.runtime.lastError;
  }
});

browser.alarms.onAlarm.addListener((alarm) => {
  switch (alarm.name) {
    case 'whiteListCheck':
      whiteListUpdateCheck().catch(() => null);
      break;

    case 'pause': {
      setBrowserIcon(TURN_ON_ICONS);
      setStorageValue(STORAGE_IS_PAUSED, DEFAULT_PAUSE_VALUE).catch(() => null);
      break;
    }

    default:
      break;
  }
});

browser.runtime.onMessage.addListener((request) => {
  if (request.message === CHANGE_ICON_ON) {
    setBrowserIcon(TURN_ON_ICONS);
    setStorageValue(STORAGE_IS_PAUSED, DEFAULT_PAUSE_VALUE).catch(() => null);
    browser.alarms.clear('pause').catch(() => null);
  }

  if (request.message === CHANGE_ICON_OFF) {
    setBrowserIcon(TURN_OFF_ICONS);
    browser.alarms.create('pause', { delayInMinutes: 30 });
  }
});
