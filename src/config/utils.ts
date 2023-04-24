import { type InternalAxiosRequestConfig, type AxiosRequestHeaders } from 'axios';
import { type Request } from './type';

export type ReturnHeaders = (config: InternalAxiosRequestConfig) => AxiosRequestHeaders;

export const getHeaders: ReturnHeaders = (config) => {
  const headers = {
    ...config.headers,
    'Content-Type': config.headers['Content-Type'] ?? 'application/json'
  } as AxiosRequestHeaders;

  return headers;
};

export const parseUrl = (url: string, params?: Request['params']) => {
  if (!params) {
    return url;
  }

  const keys = Object.keys(params);
  if (keys && keys.length > 0) {
    let path = `${keys[0]}=${params[keys[0]] as string}`;

    for (let i = 1; i < keys.length; i++) {
      path += `&${keys[i]}=${params[keys[i]] as string}`;
    }

    return `${url}?${path}`;
  }

  return url;
};
