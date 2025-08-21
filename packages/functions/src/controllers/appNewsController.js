import {getAppNewsList} from '@functions/repositories/appNewsRepository';

/**
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */
export async function getList(ctx) {
  const {hasNext, hasPre, ...resp} = await getAppNewsList(ctx.query);
  ctx.body = {...resp, pageInfo: {hasNext, hasPre}};
}
