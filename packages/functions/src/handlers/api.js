import App from 'koa';
import createErrorHandler from '@functions/middleware/errorHandler';
import * as errorService from '@functions/services/errorService';
import apiRouter from '@functions/routes/api';
import render from 'koa-ejs';
import path from 'path';
import {verifyEmbedRequest} from '@avada/core';
import shopifyConfig from '@functions/config/shopify';
import appConfig from '@functions/config/app';
import shopifyOptionalScopes from '@functions/config/shopifyOptionalScopes';

// Initialize all demand configuration for an application
const api = new App();
api.proxy = true;
const verifyEmbedConfig = {
  returnHeader: true,
  apiKey: shopifyConfig.apiKey,
  scopes: shopifyConfig.scopes,
  secret: shopifyConfig.secret,
  hostName: appConfig.baseUrl,
  isEmbeddedApp: true,
  optionalScopes: shopifyOptionalScopes
};
render(api, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});
api.use(createErrorHandler());
api.use(verifyEmbedRequest(verifyEmbedConfig));

const router = apiRouter(true);
// Register all routes for the application
api.use(router.allowedMethods());
api.use(router.routes());

// Handling all errors
api.on('error', errorService.handleError);

export default api;
