import { logError } from './log.helpers';

export const setValueToChromeStorage = <TValue>(key: string, value: TValue): void => {
  if (chrome.storage) {
    chrome.storage.local.set({ [key]: value }).then().catch((e) => logError(e));
  }
};

export const getValueToChromeStorage = <TDefault, TVal>(key: string, onChange: (value: TVal) => void, defaultValue?: TDefault): void => {
  if (chrome.storage) {
    chrome.storage.local.get(key, (result) => {
      const value: TVal = result[key] || defaultValue;
      onChange(value);
    });
  }
};

export const setValueToSyncChromeStorage = <TValue>(key: string, value: TValue): void => {
  if (chrome.storage) {
    chrome.storage.sync.set({ [key]: value }).then().catch((e) => logError(e));
  }
};

export const getValueFromSyncChromeStorage = <TDefault, TVal>(
  key: string, onChange: (value: TVal) => void, defaultValue?: TDefault): void => {
  if (chrome.storage) {
    chrome.storage.sync.get(key, (result) => {
      const value: TVal = result[key] || defaultValue;
      onChange(value);
    });
  }
};

export const subscribeChangesChromeStorage = <TValue, TOldValue>(
  key: string, onChange: (value: TValue, oldValue: TOldValue) => void,
): void => {
  if (chrome.storage) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes[key]) {
        onChange(changes[key]?.newValue, changes[key]?.oldValue);
      }
    });
  }
};
