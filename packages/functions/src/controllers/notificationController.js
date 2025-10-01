import {getCurrentShop} from '@functions/helpers/auth';

import * as notificationRepository from '@functions/repositories/notificationRepository';

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function getNotifications(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const {limit, after, before, sortBy = 'createdAt', sortOrder = 'desc'} = ctx.query;
    const data = await notificationRepository.get({
      shopId,
      after,
      before,
      limit,
      sortBy,
      sortOrder
    });
    console.log('Fetched notifications', data);
    ctx.body = {...data, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], success: false};
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

export async function deleteNotifications(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const docRefIDs = ctx.req.body;
    const data = await notificationRepository.deleteOne(docRefIDs);
    ctx.body = {data, shopId, success: true};
    console.log(docRefIDs);
    await getNotifications(ctx)
  }
  catch (e) {
    console.error(e);
    ctx.body = {data: [], shopData: {}, success: false};
  }
}
