import axios from 'axios';

const client = axios.create();

/**
 * @param url
 * @param method
 * @param options
 * @param params
 * @param resp
 * @return {Promise<any>}
 */
export async function api(url, method = 'GET', options = {}, params = {}, resp = 'data') {
  return client
    .request({
      ...options,
      headers: options.headers || {},
      method,
      url
    })
    .then(res => res[resp]);
}
