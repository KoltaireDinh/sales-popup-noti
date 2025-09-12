import App from 'koa';
import * as errorService from '@functions/services/errorService';
import webhookRouter from '@functions/routes/webhook';

const api = new App();
api.proxy = true;

const router = webhookRouter();

api.use(router.allowedMethods());
api.use(router.routes());

// Handling all errors
api.on('error', errorService.handleError);

export default api;
