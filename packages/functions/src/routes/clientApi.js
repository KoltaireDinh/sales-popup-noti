import Router from 'koa-router';
import * as clientApiController from '@functions/controllers/clientApiController';

export default function clientApiRouter() {
  const router = new Router({prefix: '/clientApi'});
  router.get(`/notifications`, clientApiController.getNotifications);
  return router;
}
