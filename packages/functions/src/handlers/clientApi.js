import App from 'koa';
import * as errorService from '@functions/services/errorService';
import clientApiRouter from '@functions/routes/clientApi';

const api = new App();
api.proxy = true;

const router = clientApiRouter();

api.use(router.allowedMethods());
api.use(router.routes());

// Handling all errors
api.on('error', errorService.handleError);

export default api;
