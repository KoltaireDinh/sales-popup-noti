import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {getCurrentShopData} from '@functions/helpers/auth';

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function exampleAction(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const data = ['Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5'].map(title => ({
      id: Math.random(),
      title
    }));

    ctx.body = {data, shopData, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], shopData: {}, success: false};
  }
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function getShopifyGraphql(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const shopify = await initShopify(shopData);
    const shopQuery = loadGraphQL('/shop.graphql');
    const shopGraphql = await shopify.graphql(shopQuery);

    ctx.body = {data: shopGraphql, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], success: false};
  }
}
