import {readFileSync} from 'fs';

/**
 * load graphql
 * @returns {string}
 * @param path
 */
export function loadGraphQL(path) {
  return readFileSync('./src/graphql/' + path, 'utf8');
}

/**
 * graphql requests
 * @param shopDomain
 * @param accessToken
 * @param query
 * @param variables
 * @returns {Promise<*>}
 */

/*
export async function graphqlRequest({shopDomain, accessToken, query, variables = {}}) {
  const URL = `https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`;
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({query, variables})
  });
  console.log(variables);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}


 */
