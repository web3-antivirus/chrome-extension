import axios from 'axios';
import qs from 'qs';

const executeSendRequest = (method: 'post') => <T>(
  urlPath: string,
  body?: Record<string, unknown>,
  headers?: Record<string, unknown>,
) => axios[method]<T>(urlPath, body ? { ...body } : undefined, { ...(headers || {}), withCredentials: false }).then(({ data }) => data);

const executeGetRequest = (method: 'get') => <T>(
  urlPath: string,
  query?: Record<string, unknown> | null,
) => {
  if (query) {
    urlPath += `?${qs.stringify(query, { encode: true, arrayFormat: 'brackets' })}`;
  }

  return axios[method]<T>(urlPath, { withCredentials: false }).then(({ data }) => data);
};

export const post = executeSendRequest('post');
export const get = executeGetRequest('get');

axios.interceptors.request.use((config) => config, (error) => Promise.reject(error));
