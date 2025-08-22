import {getShopByShopifyDomain} from '@avada/core';
import Shopify from 'shopify-api-node';

export async function listenNewOrder(ctx) {
  try {
    const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
    const orderData = ctx.req.body;
    const shop = await getShopByShopifyDomain(shopifyDomain);
    const shopify = new Shopify({
      shopName: shopifyDomain,
      accessToken: shop.accessToken
    });
    const notification = await getNotificationItem(shopify, orderData);
    await addNotification({shopId: shop.id, shopifyDomain, data: notification});
    return (ctx.body = {
      success: true
    });
  } catch (error) {
    console.error(error);
    return (ctx.body = {
      success: false
    });
  }
}
