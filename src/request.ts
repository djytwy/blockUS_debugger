import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Axios from 'axios';

class Request {
  public client: AxiosInstance;

  constructor(private readonly baseURL: string) {
    if (!baseURL) throw new TypeError('baseURL is required.');
    this.client = Axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          typeof window !== 'undefined' && window.localStorage.getItem('jwt')
            ? `bearer ${window.localStorage.getItem('jwt')?.replaceAll('"', '')}`
            : undefined,
      },
      validateStatus: () => true,
    });
    this.client.interceptors.request.use(this.onRequestFulfilled);
    this.client.interceptors.response.use(this.onResponseFulfilled);
  }

  private async onRequestFulfilled(config: AxiosRequestConfig): Promise<any> {
    //   if (localStorage) {
    //     const token = localStorage.getItem(LSK_ACCESS_TOKEN)
    //     if (token) {
    //       config.headers = Object.assign({}, config.headers, { Authorization: `Bearer ${JSON.parse(token)}` })
    //     }
    //   }
    return config;
  }

  private async onResponseFulfilled(response: AxiosResponse): Promise<AxiosResponse> {
    if (response.status === 401 && response.data?.message === 'Unauthorized') {
      // redirectToSignIn()
      return Promise.reject(response.data);
    }
    return response;
  }

  public updateJwt() {
    this.client = Axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          typeof window !== 'undefined' && window.localStorage.getItem('jwt')
            ? `bearer ${window.localStorage.getItem('jwt')?.replaceAll('"', '')}`
            : undefined,
      },
      validateStatus: () => true,
    });
    this.client.interceptors.request.use(this.onRequestFulfilled);
    this.client.interceptors.response.use(this.onResponseFulfilled);
  }

  public customJwt(jwt: string) {
    this.client = Axios.create({
      baseURL: this.baseURL,
      headers:
        typeof window !== 'undefined'
          ? {
              'Content-Type': 'application/json',
              Authorization: `bearer ${jwt.replaceAll('"', '')}`,
            }
          : {
              'Content-Type': 'application/json',
              Authorization: `bearer ${jwt.replaceAll('"', '')}`,
            },
      validateStatus: () => true,
    });
    this.client.interceptors.request.use(this.onRequestFulfilled);
    this.client.interceptors.response.use(this.onResponseFulfilled);
  }
}

const host_url = process.env.NEXT_PUBLIC_HOST as string;

export const request = new Request(host_url);

export async function fetchGet<T>(
  url = '',
  options: { local?: boolean; headers?: any; params?: any } = { local: false, headers: {}, params: {} }
): Promise<T> {
  const _url = options.local || url.includes('https://') || url.includes('http://') ? `${url}` : `${host_url}${url}`;
  console.log('fetch get: ', _url + new URLSearchParams(options.params));
  // Default options are marked with *
  const response = await fetch(_url + new URLSearchParams(options.params), {
    method: 'GET',
    headers:
      typeof window !== 'undefined' && window.localStorage.getItem('jwt')
        ? {
            Authorization: `bearer ${window.localStorage.getItem('jwt')?.replaceAll('"', '')}`,
          }
        : options.headers,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const _cloneData = response.clone();
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const _data: T = await _cloneData.json();
    console.log('GET response json: ', _data);
    return _data;
  } else {
    const _dataText: any = await _cloneData.text();
    console.log(_dataText);
    return _dataText;
  }
  // return response.json(); // parses JSON response into native JavaScript objects
}

export async function fetchPost<T>(
  url = '',
  options: { local?: boolean; headers?: any; data?: {} } = { local: false, headers: {}, data: {} }
): Promise<T> {
  const _url = options.local || url.includes('https://') || url.includes('http://') ? `${url}` : `${host_url}${url}`;
  console.log('fetch post data: ', options.data, 'url:', _url);
  // Default options are marked with *
  const response = await fetch(_url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers:
      typeof window !== 'undefined' && window.localStorage.getItem('jwt')
        ? {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `bearer ${window.localStorage.getItem('jwt')?.replaceAll('"', '')}`,
          }
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(options.data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const _data: T = await response.json();
    console.log('POST response json: ', _data);
    return _data;
  } else {
    const _dataText: any = await response.text();
    console.log(_dataText);
    return _dataText;
  }
}

export async function fetchPut<T>(
  url = '',
  options: { local?: boolean; headers?: any; data?: any } = { local: false, headers: {}, data: {} }
): Promise<T> {
  const _url = options.local || url.includes('https://') || url.includes('http://') ? `${url}` : `${host_url}${url}`;
  console.log('fetch put data: ', options.data);

  // Default options are marked with *
  const response = await fetch(_url, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers:
      typeof window !== 'undefined' && window.localStorage.getItem('jwt')
        ? {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `bearer ${window.localStorage.getItem('jwt')?.replaceAll('"', '')}`,
          }
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(options.data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const _data: T = await response.json();
    console.log('PUT response json: ', _data);
    return _data;
  } else {
    const _dataText: any = await response.text();
    return _dataText;
  }
}
