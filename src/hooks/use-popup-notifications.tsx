import { ERROR_POPUP } from 'constants/background.constants';
import { useState, useEffect, useCallback } from 'react';
import browser from 'webextension-polyfill';

export const usePopupNotification = () => {
  const [currentNotification, setCurrentNotification] = useState<string>('');

  useEffect(() => {
    if (browser.runtime) {
      browser.runtime.onMessage.addListener((request, _, sendResponse) => {
        if (request.type === ERROR_POPUP) {
          setCurrentNotification(request.message);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sendResponse({}); // https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-540043309
        return true;
      });
    }
  }, []);

  const clearPopupNotification = useCallback(() => setCurrentNotification(''), [setCurrentNotification]);

  return {
    popupNotification: currentNotification,
    clearPopupNotification,
  };
};
