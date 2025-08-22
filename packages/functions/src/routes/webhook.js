import Router from 'koa-router';
import webhookController from '../../lib/controllers/webhookController';

const router = new Router({
  prefix: '/webhook'
});

router.post('/order/new', webhookController.listenNewOrder);

export default router;
