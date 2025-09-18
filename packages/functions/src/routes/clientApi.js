import Router from 'koa-router';
import * as clientApiController from '@functions/controllers/clientController';

export default function clientApiRouter() {
  const router = new Router({prefix: '/clientApi'});

  router.get(`/notifications`, clientApiController.getClientNotifications);
  return router;
}
