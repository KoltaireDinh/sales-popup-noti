import {getCurrentShop} from '@functions/helpers/auth';
import {getShopById} from '@functions/repositories/shopRepository';
import {
  addSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription
} from '@functions/repositories/subscriptionsRepository';

/**
 * Get current subscription of a shop
 *
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export async function getSubscription(ctx) {
  const shop = await getShopById(getCurrentShop(ctx));
  ctx.body = {shop};
}

/**
 * @param {Context|Object|*} ctx
 * @returns {Promise<{data: *[], total?: number, pageInfo?: {hasNext: boolean, hasPre: boolean, totalPage?: number}}>}
 */
export async function getList(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const query = ctx.query;
    return (ctx.body = await getSubscriptions(shopId, query));
  } catch (e) {
    console.error(e);
    return (ctx.body = {data: [], error: e.message});
  }
}

/**
 * @param {Context|Object|*} ctx
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export async function createOne(ctx) {
  try {
    const data = ctx.req.body;
    const shopId = getCurrentShop(ctx);
    await addSubscription(shopId, data);
    return (ctx.body = {success: true});
  } catch (e) {
    console.error(e);
    return (ctx.body = {error: e.message});
  }
}

/**
 * @param {Context|Object|*} ctx
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export async function updateOne(ctx) {
  try {
    const {id, ...data} = ctx.req.body;
    await updateSubscription(id, data);
    return (ctx.body = {success: true});
  } catch (e) {
    console.error(e);
    return (ctx.body = {error: e.message});
  }
}

/**
 * @param {Context|Object|*} ctx
 * @returns {Promise<{success?: boolean, error?: string}>}
 */
export async function deleteOne(ctx) {
  try {
    const {id} = ctx.params;
    await deleteSubscription(id);
    return (ctx.body = {success: true});
  } catch (e) {
    console.error(e);
    return (ctx.body = {error: e.message});
  }
}
