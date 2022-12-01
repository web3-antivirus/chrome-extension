import { useEffect, useState } from 'react';

import { getRandomToken } from 'helpers/token.helpers';
import { getValueFromSyncChromeStorage, setValueToSyncChromeStorage } from 'helpers/chrome-storage.helpers';
import { STORAGE_USER_ID } from 'constants/chrome-storage.constants';

export const useUserId = (): string => {
  const [id, setId] = useState('');

  useEffect(() => {
    getValueFromSyncChromeStorage(STORAGE_USER_ID, (userId: string) => {
      if (userId) {
        setId(userId);
      }

      if (!userId) {
        const newUserId = getRandomToken();
        setId(newUserId);
        setValueToSyncChromeStorage(STORAGE_USER_ID, newUserId);
      }
    });
  }, [setId]);

  return id;
};
