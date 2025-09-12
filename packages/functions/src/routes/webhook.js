import Router from 'koa-router';
import * as webhookController from '@functions/controllers/webhookController';

export default function webhookRouter() {
  const router = new Router({prefix: '/webhook'});

  router.post('/orders/new', webhookController.listenNewOrders);
  return router;
}
