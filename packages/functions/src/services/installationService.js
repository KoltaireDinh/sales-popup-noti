import {
  createDefaultSettings,
  initShopify,
  registerWebhook,
  syncOrders
} from '@functions/services/shopifyService';
import {getShopByShopifyDomain} from '@avada/core';

export async function installApp(ctx) {
  try {
    const shopDomain = ctx.state.shopify.shop;
    const shop = await getShopByShopifyDomain(shopDomain);
    const shopify = initShopify(shop);
    await Promise.all([
      syncOrders(shopify, shop),
      createDefaultSettings(shop),
      registerWebhook(shopify)
    ]);
    console.log('Install app successfully');
  } catch (err) {
    console.error('afterInstall ERROR', err);
  }
}
