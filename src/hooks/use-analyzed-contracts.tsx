import { useCallback, useEffect, useState } from 'react';

import { getValueToChromeStorage, setValueToChromeStorage } from 'helpers/chrome-storage.helpers';
import { STORAGE_ANALYZED_CONTRACTS } from 'constants/chrome-storage.constants';

export const useAnalyzedContracts = (): [string[] | null, (value: string) => void] => {
  const [analyzedContracts, setAnalyzedContracts] = useState<string[] | null>(null);

  useEffect(() => {
    getValueToChromeStorage(STORAGE_ANALYZED_CONTRACTS, (urls: string[]) => {
      if (!urls?.length) {
        setValueToChromeStorage(STORAGE_ANALYZED_CONTRACTS, []);
        setAnalyzedContracts([]);
        return;
      }

      setAnalyzedContracts(urls);
    });
  }, [setAnalyzedContracts]);

  const setAnalyzedContract = useCallback((url: string) => {
    getValueToChromeStorage(STORAGE_ANALYZED_CONTRACTS, (urls: string[]) => {
      const newUrls = [...urls, url];
      setValueToChromeStorage(STORAGE_ANALYZED_CONTRACTS, newUrls);
      setAnalyzedContracts(newUrls);
    });
  }, [setAnalyzedContracts]);

  return [analyzedContracts, setAnalyzedContract];
};
