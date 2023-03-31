import browser from 'webextension-polyfill';

const { REACT_APP_BROWSER } = process.env;
export const setValueToChromeStorage = <TValue>(key: string, value: TValue): void => {
  if (browser.storage) {
    browser.storage.local.set({ [key]: value }).then().catch((e) => console.log(e));
  }
};

export const getValueToChromeStorage = <TDefault, TVal>(key: string, onChange: (value: TVal) => void, defaultValue?: TDefault): void => {
  if (browser.storage) {
    browser.storage.local.get(key).then((result) => {
      const value: TVal = result[key] || defaultValue;
      onChange(value);
    });
  }
};

export const setValueToSyncChromeStorage = <TValue>(key: string, value: TValue): void => {
  if (browser.storage) {
    browser.storage.sync.set({ [key]: value }).then().catch((e) => console.log(e));
  }
};

export const getValueFromSyncChromeStorage = <TDefault, TVal>(
  key: string, onChange: (value: TVal) => void, defaultValue?: TDefault): void => {
  if (browser.storage) {
    browser.storage.sync.get(key).then((result) => {
      const value: TVal = result[key] || defaultValue;
      onChange(value);
    });
  }
};

export const subscribeChangesChromeStorage = <TValue, TOldValue>(
  key: string, onChange: (value: TValue, oldValue: TOldValue) => void,
): void => {
  if (browser.storage) {
    browser.storage.onChanged.addListener((changes) => {
      if (changes[key]) {
        onChange(changes[key]?.newValue, changes[key]?.oldValue);
      }
    });
  }
};

export const getValueFromSessionChromeStorage = <TValue = Record<string, string>>(key: string): Promise<TValue | null> => {
  if (REACT_APP_BROWSER === 'chrome') {
    return chrome.storage.session.get(key) as Promise<TValue | null>;
  }
  if (browser.storage) {
    return browser.storage.local.get('session').then((result) => {
      const value: TValue = result.session;
      return value as Promise<TValue | null>;
    });
  }

  return Promise.resolve(null);
};

export const setValueToSessionChromeStorage = async <TValue>(key: string, value: TValue): Promise<void> => {
  if (REACT_APP_BROWSER === 'chrome') {
    await chrome.storage.session.set({
      [key]: value,
    });
  }

  if (browser.storage) {
    const sessionData = await getValueFromSessionChromeStorage('session');
    await browser.storage.local.set({
      session: {
        ...(sessionData || {}),
        [key]: value,
      },
    });
  }
};
