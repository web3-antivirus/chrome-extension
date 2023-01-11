import { W3A_DECISION_EVENT } from 'constants/chrome-send-message.constants';
import { PATH_TO_SCRIPT_FILE } from 'constants/global.constants';

export const addScriptTagInPage = (): void => {
  // NOTE: This adds the script.js file from src/script.js to the external page. After building the project, this file will have
  // the path script/main.js (PATH_TO_SCRIPT_FILE). Therefore, this function specifies the path after the project is built
  const script = window.document.createElement('script');
  script.src = chrome.runtime?.getURL(PATH_TO_SCRIPT_FILE);
  (window.document.head || window.document.documentElement).appendChild(script);
};

export const getDateByTimeStamp = (timestamp: number): string => new Date(timestamp).toISOString();

export const getQueryStringParams = (url: string): Record<string, string> => {
  const query = url.slice(url.indexOf('?') + 1);

  return (query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params: Record<string, string>, param) => {
        const [key, value] = param.split('=');
        params[key] = (value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '');
        return params;
      }, {})
    : {});
};

export const copyText = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};

export const groupBy = <T>(
  array: T[], predicate: (value: T, index: number, array: T[]) => string) => array.reduce((acc, value, index, arr) => {
  (acc[predicate(value, index, arr)] ||= []).push(value);
  return acc;
}, {} as { [key: string]: T[] });

export const getNftName = (id: string, name?: string): string => (name ? `${name}` : `#${id}`);

export const isNull = (value: string | number | null | undefined): boolean => value === null || value === undefined;

export const sendCustomMessage = (message: string): void => {
  const documentEvent = new CustomEvent(W3A_DECISION_EVENT, {
    detail: { decision: message },
  });
  document.dispatchEvent(documentEvent);
};

export const getShadowRoot = (): HTMLElement | null | undefined => (
  document.getElementById('web3-antivirus-host')?.shadowRoot?.getElementById('web3-antivirus')
);
