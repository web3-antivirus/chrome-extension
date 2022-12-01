import { useState, useEffect } from 'react';

import { CHANGE_URL } from 'constants/background.constants';
import { POPUP_PROTOCOL } from 'constants/url.constants';
import { logError } from 'helpers/log.helpers';

export const useCurrentUrl = (): string => {
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // 1. get current url when opening popup
  useEffect(() => {
    (async () => {
      if (chrome.tabs) {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);

        if (tab.url) {
          setCurrentUrl(tab.url);
        }
      }
    })().catch((e) => logError(e));
  }, []);

  useEffect(() => {
    //  get url on page change and open popUp
    if (chrome.tabs) {
      chrome.tabs.onUpdated.addListener((_, __, tab) => {
        if (tab.url) {
          setCurrentUrl(tab.url);
        }
      });
    }

    // get currentUrl for Inject pages
    if (chrome.runtime) {
      chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
        if (request.message === CHANGE_URL) {
          setCurrentUrl(document.location.href);
        }

        sendResponse({}); // https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-540043309
        return true;
      });
    }
  }, []);

  const getReturnValue = () => {
    if (currentUrl) {
      return currentUrl;
    }

    if (!document.location.href.includes(POPUP_PROTOCOL)) {
      return document.location.href;
    }

    return currentUrl;
  };

  return getReturnValue();
};
