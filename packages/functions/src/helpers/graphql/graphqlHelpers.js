import {readFileSync} from 'fs';

/**
 *
 * @param path
 * @returns {string}
 */
export function loadGraphQL(path) {
  return readFileSync('./src/graphql' + path, 'utf8');
}
