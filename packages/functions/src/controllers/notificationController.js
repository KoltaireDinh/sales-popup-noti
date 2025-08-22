import {getCurrentShop} from '@functions/helpers/auth';
import * as notificationRepository from '@functions/repositories/notificationRepository';

/**
 * Retrieves paginated notifications for the current authenticated shop
 * Supports pagination with cursor-based navigation
 * @param {Object} ctx - Koa context object
 * @returns {Promise<void>} Resolves with paginated notification data
 */
export async function getNotifications(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const {after, before, limit, hasCount} = ctx.query;
    const data = await notificationRepository.get({
      shopId,
      after,
      before,
      limit: limit,
      hasCount: hasCount === 'true'
    });
    ctx.body = {...data, shopId, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], shopData: {}, success: false};
  }
}

/**
 * Creates multiple notifications for the current authenticated shop using batch operations
 * @param {Object} ctx - Koa context object
 * @returns {Promise<void>} Resolves when all notifications are created
 */
export async function createNotifications(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const input = ctx.req.body;
    const data = await notificationRepository.create(input);
    ctx.body = {data, shopId, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], shopData: {}, success: false};
  }
}
