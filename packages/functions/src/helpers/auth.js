import {formatDateFields} from '@avada/firestore-utils';

/**
 * Get current shop id from Koa context
 * Shop ID was set from authentication step in Shopify login
 *
 * @param {object} ctx
 * @return {string}
 */
export function getCurrentShop(ctx) {
  return ctx.state.user.shopID;
}

/**
 * Get current shop id from Koa context
 *
 * @param ctx
 * @returns {*}
 */
export function getCurrentUserInstance(ctx) {
  return ctx.state.user;
}

/**
 * Get current shop data from Koa context
 *
 * @param ctx
 * @returns {*}
 */
export function getCurrentShopData(ctx) {
  const shopData = ctx.state.user.shopData;
  if (!shopData) return null;

  return formatDateFields(ctx.state.user.shopData);
}

/**
 * Get current shopify session from Koa context
 *
 * @param ctx
 * @returns {*}
 */
export function getCurrentSession(ctx) {
  return ctx.state.shopifySession;
}
