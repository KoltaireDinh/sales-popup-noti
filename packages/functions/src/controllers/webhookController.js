import * as notificationRepository from '../repositories/notificationRepository';
import {formatNotifications} from '@functions/helpers/formatNotifications';

/**
 * listen new orders
 * @param ctx
 * @returns {Promise<void>}
 */
export async function listenNewOrders(ctx) {
  try {
    const shopDomain = ctx.get('X-Shopify-Shop-Domain');
    const orderData = ctx.request.body;

    if (!orderData || !orderData.line_items || orderData.line_items.length === 0) {
      ctx.status = 200;
      ctx.body = {success: true, message: 'No line items to process'};
      return;
    }

    const formattedOrder = {
      customer: orderData.customer,
      lineItems: {
        edges: orderData.line_items.map(item => ({node: item}))
      },
      createdAt: orderData.created_at
    };

    const shop = {
      domain: shopDomain
    };

    const notification = formatNotifications(shop, formattedOrder);

    console.log('Creating notification:', {
      shopDomain: notification.shopDomain,
      productName: notification.productName,
      customerName: notification.firstName,
      address: `${notification.city}, ${notification.country}`,
      image: notification.productImage
    });

    await notificationRepository.createOne(notification);

    console.log('Successfully processed order webhook and created notification');
    ctx.body = {success: true, message: 'Order notification created'};
  } catch (error) {
    console.error('Error processing order webhook:');
  }
}
