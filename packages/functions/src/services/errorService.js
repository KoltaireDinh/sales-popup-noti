import {getCurrentUserInstance} from '@functions/helpers/auth';

/**
 * @param {*} err
 * @param {*} ctx
 * @return {Promise<void>}
 */
export function handleError(err, ctx) {
  const user = getCurrentUserInstance(ctx);
  if (user) {
    console.log(user, err.message);
    console.error('handle error ===', user.shopID, '===', user.shop?.shopifyDomain, '===', err);
  } else {
    console.error('Unauthenticated', err);
  }
}
