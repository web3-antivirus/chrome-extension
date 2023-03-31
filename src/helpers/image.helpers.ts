import browser from 'webextension-polyfill';
import { IPFS_PROTOCOL, IPFS_URL } from 'services/token/shared/constants';
import { getCodeExecutionEnvironment } from './environments.helpers';

export const getImageUrl = (src: string): string => {
  const { isInject } = getCodeExecutionEnvironment();

  if (isInject && browser.runtime) {
    return browser.runtime.getURL(src);
  }

  return src;
};

export const fixImageLink = (src: string | undefined): string | undefined => {
  if (src?.includes(IPFS_PROTOCOL)) {
    let newSrc = src.replace(IPFS_PROTOCOL, '');
    newSrc = `${IPFS_URL}${newSrc}`;
    return newSrc;
  }

  return src;
};
