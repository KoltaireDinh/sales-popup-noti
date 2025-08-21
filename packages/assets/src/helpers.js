import axios from 'axios';
import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getApiPrefix} from '@functions/const/app';
import isEmbeddedAppEnv from '@assets/helpers/isEmbeddedAppEnv';

const app = initializeApp({
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
});

export const auth = getAuth(app);
export const embedApp = createEmbedApp();
export const client = axios.create({timeout: 60000});
export const api = createApi();

export function getHost() {
  const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
  if (isProduction) {
    return new URLSearchParams(location.search).get('host');
  }

  const localStorageHost = localStorage.getItem('avada-dev-host');
  const host = new URLSearchParams(location.search).get('host') || localStorageHost;
  localStorage.setItem('avada-dev-host', host);

  return host;
}

function createEmbedApp() {
  if (!isEmbeddedAppEnv) return;
  const host = getHost();
  if (!host) return;
  return createApp({
    host,
    forceRedirect: true,
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY
  });
}

/**
 * @return {(uri: string, options?: {headers?, body?, method?: 'GET' | 'POST' | 'PUT' | 'DELETE'}) => Promise<any>}
 */
function createApi() {
  const prefix = getApiPrefix(isEmbeddedAppEnv);

  if (isEmbeddedAppEnv) {
    const fetchFunction = fetch;
    return async (uri, options = {}) => {
      if (options.body) {
        options.body = JSON.stringify(options.body);
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/json';
      }
      const response = await fetchFunction(prefix + uri, options);
      checkHeadersForReauthorization(response.headers, embedApp);
      return await response.json();
    };
  }

  const sendRequest = async (uri, options) => {
    const idToken = await auth.currentUser.getIdToken(false);
    return client
      .request({
        ...options,
        headers: {
          accept: 'application/json',
          ...(options.headers || {}),
          'x-auth-token': idToken
        },
        url: prefix + uri,
        method: options.method,
        data: options.body
      })
      .then(res => res.data);
  };

  return async (uri, options = {}) => sendRequest(uri, options);
}

function checkHeadersForReauthorization(headers, app) {
  if (headers.get('X-Shopify-API-Request-Failure-Reauthorize') !== '1') {
    return;
  }
  const authUrlHeader = headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url') || `/api/auth`;
  const redirect = Redirect.create(app);
  redirect.dispatch(
    Redirect.Action.REMOTE,
    authUrlHeader.startsWith('/')
      ? `https://${window.location.host}${authUrlHeader}`
      : authUrlHeader
  );
}
