import {
  createContext, FC, PropsWithChildren, useContext, useEffect, useState,
} from 'react';

import { getRandomToken } from 'helpers/token.helpers';
import { getValueFromSyncChromeStorage, setValueToSyncChromeStorage } from 'helpers/chrome-storage.helpers';
import { STORAGE_USER_ID } from 'constants/chrome-storage.constants';

type UseUserContext = {
  id: string;
}

const initialContextState = {
  id: '',
};

export const UserContext = createContext<UseUserContext>(initialContextState);

export const useUser = (): UseUserContext => useContext(UserContext);

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

export const UserContextProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const userId = useUserId();
  return (
    <UserContext.Provider value={{ id: userId }}>
      {children}
    </UserContext.Provider>
  );
};
