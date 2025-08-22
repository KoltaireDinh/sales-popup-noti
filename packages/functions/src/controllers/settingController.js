import {getCurrentShopData} from '@functions/helpers/auth';
import * as settingRepository from '@functions/repositories/settingRepository';

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function get(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const data = await settingRepository.getOne(shopData.id);
    ctx.body = {data, shopData, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], shopData: {}, success: false};
  }
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function update(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const data = await settingRepository.updateOne(shopData, ctx.req.body);
    ctx.body = {data, shopData: {}, success: true};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], shopData: {}, success: false};
  }
}
