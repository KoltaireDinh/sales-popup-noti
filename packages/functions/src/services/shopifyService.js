import {prepareShopData} from '@avada/core';
import shopifyConfig from '../config/shopify';
import Shopify from 'shopify-api-node';
import * as notificationRepository from '../repositories/notificationRepository';
import * as settingRepository from '../repositories/settingRepository';
import defaultSettings from '../const/defaultSettings';
import {graphqlRequest, loadGraphQL} from '../helpers/graphql/graphqlHelpers';
import {API_VERSION} from '@avada/core/build/constants';
import appConfig from '../config/app';
import {isEmpty} from '@avada/utils';
/**
 *  Sync orders to notifications
 * @param shopDomain
 * @param accessToken
 * @param limit
 * @returns {Promise<void>}
 */
export async function syncOrdersWithGraphQL({shopDomain, accessToken}, limit = 30) {
  try {
    console.log('Starting sync for shop:', shopDomain);

    console.log('Access token exists:', !!accessToken);

    const orderQuery = loadGraphQL('orders.graphql');

    const variables = {
      first: parseInt(limit, 10) || 30
    };

    console.log('Making GraphQL request with variables:', variables);

    const data = await graphqlRequest({
      shopDomain,

      accessToken,

      query: orderQuery,

      variables
    });

    console.log('Orders fetched from GraphQL:', {
      hasOrders: !!data?.orders,

      orderCount: data?.orders?.edges?.length || 0
    });

    const ordersList = data.orders.edges;

    const notifications = [];

    for (let i = 0; i < ordersList.length; i++) {
      const order = ordersList[i];

      const node = order.node;

      const customer = node.customer;

      const lineItem = node.lineItems?.edges?.[0]?.node;

      const productImage = lineItem?.product?.images?.edges?.[0]?.node?.url;

      const notification = {
        shopDomain: shopDomain,

        firstName: customer?.firstName || 'Anonymous',

        city: customer?.defaultAddress?.city || 'Unknown',

        country: customer?.defaultAddress?.country || 'Unknown',

        productId: lineItem?.product?.id || node.id,

        productImage: productImage || '',

        productName: lineItem?.title || 'Unknown Product',

        timestamp: new Date(node.createdAt)
      };

      notifications.push(notification);
    }

    await notificationRepository.create(notifications);

    console.log(`Synced ${notifications.length} notifications for ${shopDomain}`);
  } catch (err) {
    console.error('Error syncing orders with GraphQL:', {
      message: err.message,

      stack: err.stack,

      shopDomain
    });

    throw err;
  }
}

/*
/**
 * Register webhook for order creation using GraphQL
 * @param {string} shopDomain
 * @param {string} accessToken
 * @returns {Promise<void>}

export async function registerOrderWebhookGraphQL({shopDomain, accessToken}) {
  try {
    console.log('Registering order webhook for shop:', shopDomain);

    const webhookQuery = loadGraphQL('webhook.graphql');

    const variables = {
      topic: 'ORDERS_CREATE',
      webhookSubscription: {
        callbackUrl: `https://${appConfig.baseUrl}/api/webhooks/orders/create`,
        format: 'JSON'
      }
    };

    console.log('Creating webhook with URL:', variables.webhookSubscription.callbackUrl);

    const data = await graphqlRequest({
      shopDomain,
      accessToken,
      query: webhookQuery,
      variables
    });

    if (data?.webhookSubscription) {
      console.log('Webhook registered successfully:', {
        id: data.webhookSubscription.id,
        callbackUrl: data.webhookSubscription.callbackUrl,
        format: data.webhookSubscription.format
      });
      return data.webhookSubscription;
    }
  } catch (error) {
    console.error('Error registering order webhook:', error);
    throw error;
  }
}
 */

export async function registerWebhook(shopify) {
  try {
    const activeWebhooks = await shopify.webhook.list();
    const outdatedWebhooks = activeWebhooks.filter(
      webhook => !webhook.address.includes(appConfig.baseUrl)
    );
    if (!isEmpty(outdatedWebhooks)) {
      await Promise.all(
        outdatedWebhooks.map(webhook => {
          shopify.webhook.delete(webhook.id);
        })
      );
    }
    const address = `https://{appConfig.baseUrl}/api/webhook/orders/create`;
    const webhooks = await shopify.webhook.list({address});
    console.log(webhooks);
    if (webhooks.length > 0) {
      console.log('Webhook already exists');
      return webhooks[0];
    } else {
      const webhookPayload = {
        topic: 'orders/create',
        address: address,
        format: 'json'
      };
      console.log('Webhook registered successfully');
      return shopify.webhook.create(webhookPayload);
    }
  } catch (error) {
    console.error('Error registering webhook', error);
    throw error;
  }
}

export async function createDefaultSettings({shopId, shopDomain}) {
  try {
    console.log('Creating default settings for shop:', shopId);
    const defaultData = await settingRepository.createOne({
      data: defaultSettings,
      shopId: shopId,
      shopDomain: shopDomain
    });
    if (defaultData) {
      console.log('Created default settings');
      return defaultData;
    }
  } catch (error) {
    console.error('Error creating default settings:', error);
    throw error;
  }
}

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
    accessToken,
    apiVersion,
    autoLimit: true
  });
}
