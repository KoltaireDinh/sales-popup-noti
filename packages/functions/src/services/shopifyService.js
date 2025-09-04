import {prepareShopData} from '@avada/core';
import shopifyConfig from '../config/shopify';
import Shopify from 'shopify-api-node';
import * as notificationRepository from '../repositories/notificationRepository';
import * as settingRepository from '../repositories/settingRepository';
import defaultSettings from '../const/defaultSettings';
import fs from 'fs';
import path from 'path';

export const API_VERSION = '2024-04';

/**
 * loadGQL
 * @param file
 * @returns {string}
 */
function loadGraphQL(file) {
  return fs.readFileSync(path.join(__dirname, '..', 'graphql', file), 'utf8');
}

/**
 *
 * @param shopDomain
 * @param accessToken
 * @param query
 * @param variables
 * @returns {Promise<*>}
 */
async function graphqlRequest({shopDomain, accessToken, query, variables = {}}) {
  const URL = `https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`;
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({query, variables})
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

/**
 *
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
        productName: lineItem?.name || 'Unknown Product',
        createdAt: new Date(node.createdAt)
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

// Simplified version without external dependencies (alternative)
/* export async function syncOrdersSimple(shopDomain, accessToken, limit = 30) {
  try {
    console.log('🔄 Simple sync starting for:', shopDomain);

    const query = `
      query Orders($first: Int!) {
        orders(first: $first, reverse: true, sortKey: CREATED_AT) {
          edges {
            node {
              id
              createdAt
              customer {
                firstName
                defaultAddress {
                  city
                  country
                }
              }
              lineItems(first: 1) {
                edges {
                  node {
                    name
                    product {
                      id
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        query: query,
        variables: {first: limit}
      })
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    console.log('📊 Simple sync response:', {
      hasData: !!result.data,
      hasOrders: !!result.data?.orders,
      orderCount: result.data?.orders?.edges?.length || 0
    });

    if (!result.data?.orders?.edges?.length) {
      console.log('⚠️ No orders found, creating test notification');

      const testId = await notificationRepository.createOne({
        shopDomain: shopDomain,
        firstName: 'Test Customer',
        city: 'Test City',
        country: 'Test Country',
        productId: 'test-simple-' + Date.now(),
        productImage:
          'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png',
        productName: 'Test Product (Simple Sync)',
        createdAt: new Date()
      });
      console.log('✅ Test notification created:', testId);
      return;
    }

    const orders = result.data.orders.edges;
    const notifications = orders.map(orderEdge => {
      const order = orderEdge.node;
      const customer = order.customer;
      const lineItem = order.lineItems?.edges?.[0]?.node;
      const productImage = lineItem?.product?.images?.edges?.[0]?.node?.url;

      return {
        shopDomain: shopDomain,
        firstName: customer?.firstName || 'Anonymous',
        city: customer?.defaultAddress?.city || 'Unknown',
        country: customer?.defaultAddress?.country || 'Unknown',
        productId: lineItem?.product?.id || order.id,
        productImage: productImage || '',
        productName: lineItem?.name || 'Unknown Product',
        createdAt: new Date(order.createdAt)
      };
    });

    console.log(`💾 Creating ${notifications.length} notifications...`);
    await notificationRepository.create(notifications);
    console.log(`✅ Simple sync created ${notifications.length} notifications`);
  } catch (error) {
    console.error('❌ Simple sync error:', error.message);
    throw error;
  }
}*/

export const createDefaultSettings = async ({shopId, shopDomain}) => {
  try {
    console.log('⚙️ Creating default settings for shop:', shopId);
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
};

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
