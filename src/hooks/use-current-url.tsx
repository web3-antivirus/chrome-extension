import { CHANGE_URL } from 'constants/background.constants';
import { POPUP_PROTOCOL } from 'constants/url.constants';
import { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';

export const useCurrentUrl = (): string => {
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // 1. get current url for when opening popUp
  useEffect(() => {
    (async () => {
      if (browser.tabs) {
        const queryOptions = { active: true, currentWindow: true };
        const [tab] = await browser.tabs.query(queryOptions);

        if (tab.url) {
          setCurrentUrl(tab.url);
        }
      }
    })().catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    // get url on page change and open popUp
    if (browser.tabs) {
      browser.tabs.onUpdated.addListener((_, __, tab) => {
        if (tab.url) {
          setCurrentUrl(tab.url);
        }
      });
    }

    // get currentUrl for Inject pages
    if (browser.runtime) {
      browser.runtime.onMessage.addListener((request, _, sendResponse) => {
        if (request.message === CHANGE_URL) {
          setCurrentUrl(document.location.href);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
