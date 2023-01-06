export const setValueToChromeStorage = <TValue>(key: string, value: TValue): void => {
  if (chrome.storage) {
    chrome.storage.local.set({ [key]: value }).then().catch((e) => console.log(e));
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
    chrome.storage.sync.set({ [key]: value }).then().catch((e) => console.log(e));
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

export const getValueFromSessionChromeStorage = <TValue>(key: string): Promise<TValue | null> => {
  if (chrome.storage) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return chrome.storage.session.get(key) as Promise<TValue | null>;
  }

  return Promise.resolve(null);
};

export const setValueToSessionChromeStorage = async <TValue>(key: string, value: TValue): Promise<void> => {

  if (chrome.storage) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await chrome.storage.session.set({
      [key]: value,
    });
  }
};
