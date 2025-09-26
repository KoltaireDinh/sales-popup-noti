import * as notificationRepository from '@functions/repositories/notificationRepository';

import {formatNotification} from '@functions/helpers/formatNotifications';
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
  ctx.status = 200;
  ctx.body = {success: true};
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

    await notificationRepository.createOne(formatNotification(shop, orderData));
  } catch (e) {
    console.error('Error creating notifications with formatNotifications function: ', e);
    ctx.body = {data: [], success: false};
  }
}
