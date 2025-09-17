import * as notificationRepository from '@functions/repositories/notificationRepository';
import {formatNotifications} from '@functions/helpers/formatNotifications';
import {initShopify} from '@functions/services/shopifyService';
import {loadGraphQL} from '@functions/helpers/graphql/graphqlHelpers';
import {getShopByShopifyDomain} from '@avada/core';
import {API_VERSION} from '@avada/core/build/constants';

/**
 * Handles new order webhook events from Shopify
 * Creates a notification when a new order is placed
 * @param {Object} ctx - Koa context object
 * @returns {Promise<void>} Resolves when notification is created
 */
export async function listenNewOrders(ctx) {
  try {
    console.log('Listen new orders function triggered :');
    const order = ctx.req.body;
    const shopDomain = ctx.request.header['x-shopify-shop-domain'];
    const shop = await getShopByShopifyDomain(shopDomain);
    const shopify = initShopify(shop, API_VERSION);
    const query = loadGraphQL('notification.graphql');

    const notificationGraphql = await shopify.graphql(query, {
      orderId: order.admin_graphql_api_id
    });
    const orderData = notificationGraphql?.node;

    await notificationRepository.createOne(formatNotifications(shop, orderData));
    ctx.body = {data: notificationGraphql, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], success: false};
  }
}
