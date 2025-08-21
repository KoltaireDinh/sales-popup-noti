import appRoute from '../const/app';
import isEmbeddedAppEnv from './isEmbeddedAppEnv';

/**
 * @param url
 * @returns {string}
 */
export function getUrl(url) {
  return (isEmbeddedAppEnv ? appRoute.embed : appRoute.standalone) + url;
}
