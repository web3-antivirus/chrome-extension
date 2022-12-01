import { useEffect, useState } from 'react';

import { setValueToChromeStorage, getValueToChromeStorage, subscribeChangesChromeStorage } from 'helpers/chrome-storage.helpers';
import { STORAGE_THEME } from 'constants/chrome-storage.constants';
import { getSiteName } from 'helpers/url.helpers';
import { DEFAULT_THEME, DEFAULT_THEMES, THEME } from 'constants/theme.constants';
import { ThemeList } from 'types/marketplaces.type';

import { useCurrentUrl } from './use-current-url';

type TReturnUseCurrentTheme = {
  theme: string,
  setTheme: (newTheme: string) => void
}

export const useCurrentTheme = (): TReturnUseCurrentTheme => {
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME);
  const [currentThemeList, setCurrentThemeList] = useState<ThemeList>(DEFAULT_THEMES);
  const url = useCurrentUrl();

  subscribeChangesChromeStorage(STORAGE_THEME, (themeList: ThemeList, oldThemeList: ThemeList) => {
    setCurrentThemeList(themeList);
    if (url) {
      const siteName = getSiteName(url);
      const theme = themeList?.[siteName] || themeList?.unknown;
      const oldTheme = oldThemeList?.[siteName] || oldThemeList?.unknown;
      setCurrentTheme(theme);

      document.body.classList.add(theme);
      if (theme !== oldTheme) {
        document.body.classList.remove(oldTheme);
      }
    }
  });

  useEffect(() => {
    getValueToChromeStorage(STORAGE_THEME, (themeList: ThemeList) => {
      const newtThemeList = themeList || DEFAULT_THEMES;
      setCurrentThemeList(newtThemeList);

      if (!themeList) {
        setValueToChromeStorage(STORAGE_THEME, DEFAULT_THEMES);
      }

      if (url) {
        const siteName = getSiteName(url);
        const theme = newtThemeList?.[siteName] || newtThemeList?.unknown;
        setCurrentTheme(theme);
        document.body.classList.add(theme);

        const removeClass = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
        document.body.classList.remove(removeClass);
      }
    });

  }, [url]);

  const setTheme = (newThemeValue: string) => {
    if (url) {
      const siteName = getSiteName(url);
      const newList = currentThemeList;

      if (currentThemeList[siteName]) {
        newList[siteName] = newThemeValue;
      } else {
        newList.unknown = newThemeValue;
      }

      setValueToChromeStorage(STORAGE_THEME, newList);
    }
  };

  useEffect(() => {
    // NOTE: this code is needed to set the default theme when working in http://localhost:3000
    if (!chrome.storage) {
      document.body.classList.add(DEFAULT_THEME);
    }
    // end

    if (!url && !document.body.classList.contains(THEME.LIGHT) && !document.body.classList.contains(THEME.DARK)) {
      document.body.classList.add(DEFAULT_THEME);
    }
  }, []);

  return { theme: currentTheme, setTheme };
};
