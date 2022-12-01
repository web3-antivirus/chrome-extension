import { PATH_TO_SCRIPT_FILE } from 'constants/global.constants';

export const addScriptTagInPage = (): void => {
  // NOTE: This adds the script.js file from src/script.js to the external page. After building the project, this file will have
  // the path script/main.js (PATH_TO_SCRIPT_FILE). Therefore, this function specifies the path after the project is built
  const script = window.document.createElement('script');
  script.src = chrome.runtime?.getURL(PATH_TO_SCRIPT_FILE);
  (window.document.head || window.document.documentElement).appendChild(script);
};

export const getDateByTimeStamp = (timestamp: number): string => new Date(timestamp).toLocaleDateString();

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
