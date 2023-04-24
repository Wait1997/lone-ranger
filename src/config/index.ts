import Axios, { type AxiosInstance, type Method, type AxiosResponse } from 'axios';
import { getHeaders, parseUrl } from './utils';
import { type Options, type Request } from './type';

class Webapi {
  private readonly axios: AxiosInstance;
  private readonly reqInterceptors: number;
  private readonly resInterceptors: number;
  private readonly controller: AbortController;

  constructor(options: Options) {
    this.controller = new AbortController();
    this.axios = Axios.create(options.config);
    this.reqInterceptors = this.axios.interceptors.request.use((config) => {
      return {
        ...config,
        headers: getHeaders(config)
      };
    });
    this.resInterceptors = this.axios.interceptors.response.use(
      (response) => {
        if (response.status === 200) {
          return response;
        }
        return response;
      },
      (error) => {
        return error;
      }
    );
  }

  public get<T>(url: string, params?: Request['params'], config?: Request['config']): Promise<AxiosResponse<T>> {
    return this.api<T>(url, { params, config }, 'get');
  }

  public delete<T>(url: string, params?: Request['params'], config?: Request['config']): Promise<AxiosResponse<T>> {
    return this.api<T>(url, { params, config }, 'delete');
  }

  public post<T>(url: string, params: Request['params'], config?: Request['config']): Promise<AxiosResponse<T>> {
    return this.api<T>(url, { params, config }, 'post');
  }

  public patch<T>(url: string, params: Request['params'], config?: Request['config']): Promise<AxiosResponse<T>> {
    return this.api<T>(url, { params, config }, 'patch');
  }

  public put<T>(url: string, params: Request['params'], config?: Request['config']): Promise<AxiosResponse<T>> {
    return this.api<T>(url, { params, config }, 'put');
  }

  public getSignal(): AbortSignal {
    const signal = this.controller.signal;
    return signal;
  }

  public abort(): void {
    this.controller.abort();
  }

  private api<T>(url: string, req: Request, method: Method = 'get'): Promise<AxiosResponse<T>> {
    if (url.split('?')[1] ?? /get|delete/i.test(method)) {
      url = parseUrl(url, req.params);
    }
    method = method.toLocaleLowerCase() as Method;

    switch (method) {
      case 'get':
        return this.axios.get(url, req.config);
      case 'delete':
        return this.axios.delete(url, req.config);
      case 'post':
        return this.axios.post(url, req.params, req.config);
      case 'patch':
        return this.axios.patch(url, req.params, req.config);
      case 'put':
        return this.axios.put(url, req.params, req.config);
      default:
        return this.axios.get(url, req.config);
    }
  }
}

const currentEnv = process.env;
const baseURL = currentEnv.REACT_APP_API_URL!;
const timeout = 20000;

export const webapi: Webapi = new Webapi({
  config: {
    baseURL: `${baseURL}`,
    timeout
  }
});
