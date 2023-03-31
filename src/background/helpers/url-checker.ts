import levenshtein from 'fast-levenshtein';
import browser from 'webextension-polyfill';
import { ExtensionUserActionType } from '../../interfaces/common.interfaces';
import { getValueFromSessionChromeStorage, setValueToSessionChromeStorage } from '../../helpers/chrome-storage.helpers';
import { SAFE_TLDS, SITE_STATUSES } from '../constants';
import { URL_STATUSES } from '../../constants/background.constants';
import {
  CHECKED_URLS, PREVIOUS_URL, SESSION_WHITELIST, STORAGE_IS_PAUSED, STORAGE_TOKEN, STORAGE_WHITELIST_FOR_WEB3_GUARD,
} from '../../constants/chrome-storage.constants';
import { getUrlAnalyze, sendUserAction } from '../api';
import { redirectToPhishing } from './browser';
import { getSiteName, getStorageValue } from './common';

export const isSiteSuspicious = (siteName: string, whiteList: string[]): { isSuspicious: boolean, originalUrl: string | null } => {
  if (!siteName) return { isSuspicious: false, originalUrl: null };
  const siteHostname = new URL(siteName).hostname;
  const [domain, tld] = siteHostname.replace('www.', '').split('.');

  if (domain.length <= 3 && SAFE_TLDS.includes(tld)) return { isSuspicious: false, originalUrl: null };

  const result = whiteList.find((site) => {
    const { hostname } = new URL(site);
    const hasSubDomain = hostname.split('.').length > 2;
    if (hasSubDomain) return false;
    const levenshteinDistance = levenshtein.get(hostname.replace('www.', ''), siteHostname);
    return levenshteinDistance === 1;
  });

  return { isSuspicious: Boolean(result), originalUrl: result ?? null };
};

export const handleUrlCheck = async (tab: browser.Tabs.Tab, changeInfo: browser.Tabs.OnUpdatedChangeInfoType): Promise<null> => {
  const token = await getStorageValue(STORAGE_TOKEN);

  const isTabLoadingStarted = token
  && tab
  && tab.url
  && changeInfo.status === URL_STATUSES.loading
  && tab.active;

  if (isTabLoadingStarted) {
    const pauseData = await getStorageValue(STORAGE_IS_PAUSED);

    const isNotPaused = !pauseData
      || !pauseData.isPaused
      || !pauseData.pauseUntilTime
      || new Date(pauseData.pauseUntilTime) < new Date();

    if (
      isNotPaused
    ) {

      const w3aWhiteList = await getStorageValue(
        STORAGE_WHITELIST_FOR_WEB3_GUARD,
        [],
      );
      const previousURLData = await getValueFromSessionChromeStorage(PREVIOUS_URL);
      const siteName = getSiteName(tab.url as string);
      if (siteName === previousURLData?.previousURL) return null;

      const [checkedUrlsData, whiteListUrlsData] = await Promise.all([
        getValueFromSessionChromeStorage<Record<string, string>>(CHECKED_URLS),
        getValueFromSessionChromeStorage<Record<string, string>>(SESSION_WHITELIST),
      ]);

      const checkedUrls = (checkedUrlsData?.[CHECKED_URLS] || {}) as Record<string, string>;

      if (checkedUrls[siteName] === 'neutral') {
        return null;
      }

      const whiteListUrls = (whiteListUrlsData?.[SESSION_WHITELIST] || {}) as Record<string, string>;

      if (Object.keys(whiteListUrls).includes(siteName)) {
        if (typeof whiteListUrls[siteName] === 'string' && new Date(whiteListUrls[siteName]) < new Date()) {
          delete whiteListUrls[siteName];
          setValueToSessionChromeStorage(SESSION_WHITELIST, whiteListUrls);
        }

        return null;
      }

      if (
        (checkedUrls[siteName] === SITE_STATUSES.SUSPICIOUS
          || checkedUrls[siteName] === SITE_STATUSES.DANGEROUS)
        && !w3aWhiteList.includes(siteName)
      ) {
        await redirectToPhishing('', siteName);
      } if (!w3aWhiteList.includes(siteName)) {
        const { isSuspicious, originalUrl } = isSiteSuspicious(siteName, w3aWhiteList);

        if (isSuspicious) {
          await Promise.all([
            setValueToSessionChromeStorage(CHECKED_URLS, { ...checkedUrls, [siteName]: SITE_STATUSES.SUSPICIOUS }),
            sendUserAction(
              ExtensionUserActionType.WebsiteLevenshteinDetection,
              { originalURL: originalUrl ?? '', suspiciousURL: siteName },
              tab.url,
            )]).catch((e) => console.log(e));
          await redirectToPhishing('', siteName);
          return null;
        }

        const { status, payload } = await getUrlAnalyze(siteName);

        await Promise.all([
          setValueToSessionChromeStorage(CHECKED_URLS, { ...checkedUrls, [siteName]: status }),
          setValueToSessionChromeStorage(PREVIOUS_URL, siteName),
        ]);

        if (
          status === SITE_STATUSES.SUSPICIOUS
          || status === SITE_STATUSES.DANGEROUS
        ) {
          await redirectToPhishing((payload || {}).nearestURL, siteName);
        }
      }
    }
  }
  return null;
};
