import { useState, useEffect, useCallback } from 'react';
import { ERROR_POPUP } from 'constants/background.constants';

interface IPopupNotificationReturn {
  popupNotification: string;
  clearPopupNotification: () => void;
}

export const usePopupNotification = (): IPopupNotificationReturn => {
  const [currentNotification, setCurrentNotification] = useState<string>('');

  useEffect(() => {
    if (chrome.runtime) {
      chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
        if (request.type === ERROR_POPUP) {
          setCurrentNotification(request.message);
        }

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
