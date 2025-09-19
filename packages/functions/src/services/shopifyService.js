import {prepareShopData} from '@avada/core';
import shopifyConfig from '../config/shopify';
import Shopify from 'shopify-api-node';
import * as notificationRepository from '../repositories/notificationRepository';
import * as settingRepository from '../repositories/settingRepository';
import defaultSettings from '../const/defaultSettings';
import {loadGraphQL} from '../helpers/graphql/graphqlHelpers';
import {API_VERSION} from '@avada/core/build/constants';
import appConfig from '../config/app';
import * as notifications from '@functions/helpers/formatNotifications';
import {isEmpty} from '@avada/utils';

/**
 * Initialize Shopify instance
 * @param shopData
 * @param apiVersion
 * @returns {Shopify}
 */
export function initShopify(shopData, apiVersion = API_VERSION) {
  const shopParsedData = prepareShopData(shopData.id, shopData, shopifyConfig.accessTokenKey);
  const {shopifyDomain, accessToken} = shopParsedData;
  return new Shopify({
    shopName: shopifyDomain,
    accessToken: accessToken,
    apiVersion,
    autoLimit: true
  });
}

// REVIEW
/**
 *  Sync orders to notifications
 * @returns {Promise<void>}
 * @param shopify
 * @param shop
 */
// TODO: đổi sang RESTApi (shopify-api-node)
export async function syncOrdersWithGraphQL(shopify, shop) {
  const orderQuery = loadGraphQL('orders.graphql');
  const data = await shopify.graphql(orderQuery, {
    first: 30
  });
  // TODO: for loops => map with formatted Notifications
  await notificationRepository.create(
    data.orders.edges.map(order => notifications.formatNotifications(shop, order.node))
  );
  console.log(`Synced ${data.orders.edges.length} notifications`);
}
// REVIEW
/**
 * register webhook
 * @param shopify
 * @returns {Promise<Shopify.IWebhook|*>}

 */
export async function registerWebhook(shopify) {
  // NOTE: Get current active hooks
  const currentWebhooks = await shopify.webhook.list();
  // NOTE: Filter webhooks that does not include the webhook with defined baseUrl
  const unusedWebhooks = currentWebhooks.filter(
    webhook => !webhook.address.includes(appConfig.baseUrl)
  );
  if (!isEmpty(unusedWebhooks)) {
    await Promise.all(
      unusedWebhooks.map(webhook => {
        shopify.webhook.delete(webhook.id);
      })
    );
  }
  const webhooks = await shopify.webhook.list({
    address: `https://${appConfig.baseUrl}/webhook/orders/new`
  });
  console.log(webhooks);
  if (webhooks.length === 0) {
    return shopify.webhook.create({
      topic: 'orders/create',
      address: `https://${appConfig.baseUrl}/webhook/orders/new`,
      format: 'json'
    });
  }
  console.log('Webhook created successfully');
}
// REVIEW
/**
 * create default settings for shop
 * @returns {Promise<string>}
 * @param shop
 */
export async function createDefaultSettings(shop) {
  await settingRepository.createOne({
    data: defaultSettings,
    shopData: {
      id: shop.id,
      shopDomain: shop.shopifyDomain
    }
  });
  console.log(`Created default setting for shop ${shop.name}`);
}

export async function registerScripttags(shopify) {
  try {
    await shopify.scriptTag.create({
      event: 'onload',
      src: 'https://localhost:3001/scripttag/avada-sale-pop.min.js'
    });
  } catch (err) {
    console.error('Error registering script-tag', err);
  }
}
