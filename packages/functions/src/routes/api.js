import Router from 'koa-router';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import {getApiPrefix} from '@functions/const/app';
import * as settingController from '@functions/controllers/settingController';
import * as notificationController from '@functions/controllers/notificationController';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/shops', shopController.getUserShops);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/notifications', notificationController.getNotifications);
  router.post('/notifications', notificationController.createNotifications);
  router.get('/settings', settingController.get);
  router.put('/settings', settingController.update);
  return router;
}
