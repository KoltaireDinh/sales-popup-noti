import * as notificationRepository from '@functions/repositories/notificationRepository';
import * as settingRepository from '@functions/repositories/settingRepository';

/**
 * Retrieves notifications and settings for a specific shop domain
 * Used by client-side applications to display notifications with settings
 * @param {Object} ctx - Koa context object
 * @returns {Promise<void>} Resolves with notifications and settings data
 */
export async function getClientNotifications(ctx) {
  try {
    const shopDomain = ctx.query.shopDomain;
    console.log(shopDomain);
    if (!shopDomain) {
     // return ctx.body = {data: [], shopDomain: '', success: false};
      throw new Error('shopDomain not found');
    }

    const [notifications, settings] = await Promise.all([
      notificationRepository.getByDomain(shopDomain),
      settingRepository.getOneByDomain(shopDomain)
    ]);
    ctx.body = {
      notifications: notifications,
      settings: settings
    };
  } catch (error) {
    console.error('Error getting client notifications', error);
    ctx.body = {data: [], shopDomain: '', success: false};
  }
}
