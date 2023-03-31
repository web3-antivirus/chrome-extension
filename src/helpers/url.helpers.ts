import qs from 'qs';
import { ETH_EXPLORER_URL } from 'constants/blockchains.constants';
import { CHECK_NFT_PATH } from 'constants/check-nft.constants';

export const getSiteName = (url?: string): string => {
  const domain = url && (new URL(url));
  return domain ? domain.origin : '';
};

export const getDomainNameWithoutProtocol = (url?: string, withTopLevelDomain?: boolean): string => {
  if (!url) {
    return '';
  }

  const domain = (new URL(url));
  const hostName = domain.hostname;
  const hostNameWithoutProtocol = hostName.replace('www.', '').split('.')[0];

  return withTopLevelDomain ? hostName : hostNameWithoutProtocol;
};

export const getUrlWithoutTrailingSlash = (url: string) => {
  const lastSymbol = url.slice(-1);
  if (lastSymbol === '/') {
    return url.slice(0, -1);
  }

  return url;
};

export const prepareUrl = (path: string, params: { [key: string]: string | number }): string => {
  const query: { [key: string]: string | number } = {};
  const result = Object
    .keys(params)
    .reduce((str, key) => {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (str.match(new RegExp(`:${key}`))) {
        str = str.replace(new RegExp(`:${key}`), params[key].toString());
      } else {
        query[key] = params[key];
      }
      return str;
    }, path);

  return qs.stringify(query) ? `${result}?${qs.stringify(query)}` : result;
};

export const getEtherscanAddressUrl = (address: string): string => `${ETH_EXPLORER_URL}/address/${address}`;

export const getTokenUrl = (address: string, id: string): string => `${CHECK_NFT_PATH}token/${address}/${id}`;
export const getCollectionUrl = (address: string, id: string): string => `${CHECK_NFT_PATH}search/?collection=${id}&query=${address}`;
export const removeSubDomainFromUrl = (url: string): string => url.replace('www.', '');
