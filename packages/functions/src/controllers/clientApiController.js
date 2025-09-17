import * as notificationRepository from '@functions/repositories/notificationRepository';
import * as settingRepository from '@functions/repositories/settingRepository';

/**
 * Retrieves notifications and settings for a specific shop domain
 * Used by client-side applications to display notifications with settings
 * @param {Object} ctx - Koa context object
 * @returns {Promise<void>} Resolves with notifications and settings data
 */
export async function getNotifications(ctx) {
  try {
    const {shop} = ctx.query;

    const [notifications, setting] = await Promise.all([
      notificationRepository.getByDomain(shop),
      settingRepository.getOneByDomain(shop)
    ]);
    const updatedNotifications = notifications.map(notification => {
      return {
        ...notification,
      };
    });
    const data = {
      settings: setting,
      notifications: updatedNotifications
    };

    ctx.body = {...data};
  } catch (e) {
    console.error(e);
    ctx.body = {data: [], shopDomain: '', success: false};
  }
}
