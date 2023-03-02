import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { registry } from '../registry';

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.data) {
      throw error.response?.data;
    } else if (error.response?.statusText) {
      throw new Error(error.response?.statusText);
    } else {
      throw error;
    }
  }
);

export class HttpClient {
  private readonly API_URL: string = 'api';

  async request<T = any>(options: { serviceName?: string } & AxiosRequestConfig): Promise<T> {
    const { uiService } = registry;
    if (uiService) uiService.showLoading();
    try {
      if (!options.serviceName && !options.url) throw new Error('Request must need url or service name');

      const isUrlName = options.serviceName?.startsWith('/') || options.serviceName?.includes('://');

      options.method ??= 'get';
      options.url ??= isUrlName ? options.serviceName : `${this.API_URL}/${options.serviceName}`;
      const result = await axios(options);
      return result.data;
    } finally {
      if (uiService) uiService.hideLoading();
    }
  }

  get<T = any>(serviceName: string, params?: any): Promise<T> {
    return this.request({ serviceName, params, method: 'get' });
  }

  post<T = any>(serviceName: string, ...params: any[]): Promise<T> {
    return this.request({ serviceName, data: params, method: 'post' });
  }

  put<T = any>(serviceName: string, ...params: any[]): Promise<T> {
    return this.request({ serviceName, data: params, method: 'put' });
  }

  delete<T = any>(serviceName: string, ...params: any[]): Promise<T> {
    return this.request({ serviceName, data: params, method: 'delete' });
  }
}

export const httpClient = new HttpClient();
