import App from 'koa';
import 'isomorphic-fetch';
import {contentSecurityPolicy, getShopByShopifyDomain, shopifyAuth} from '@avada/core';
import shopifyConfig from '@functions/config/shopify';
import render from 'koa-ejs';
import path from 'path';
import createErrorHandler from '@functions/middleware/errorHandler';
import firebase from 'firebase-admin';
import appConfig from '@functions/config/app';
import shopifyOptionalScopes from '@functions/config/shopifyOptionalScopes';
import {
  createDefaultSettings,
  registerScripttags,
  registerWebhook, syncOrders,
} from '@functions/services/shopifyService';
import Shopify from 'shopify-api-node';

if (firebase.apps.length === 0) {
  firebase.initializeApp();
}

// Initialize all demand configuration for an application
const app = new App();
app.proxy = true;

render(app, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});
app.use(createErrorHandler());
app.use(contentSecurityPolicy(true));

// Register all routes for the application
app.use(
  shopifyAuth({
    apiKey: shopifyConfig.apiKey,
    accessTokenKey: shopifyConfig.accessTokenKey,
    firebaseApiKey: shopifyConfig.firebaseApiKey,
    scopes: shopifyConfig.scopes,
    secret: shopifyConfig.secret,
    successRedirect: '/embed',
    initialPlan: {
      id: 'free',
      name: 'Free',
      price: 0,
      trialDays: 0,
      features: {}
    },
    hostName: appConfig.baseUrl,
    isEmbeddedApp: true,
    afterThemePublish: ctx => {
      // TODO: Publish assets when theme is published or changed here
      return (ctx.body = {
        success: true
      });
    },
    optionalScopes: shopifyOptionalScopes,
    // Sync 30 orders, register webhooks, create default settings
    afterInstall: async ctx => {
      try {
        const shopDomain = ctx.state.shopify.shop;
        const accessToken = ctx.state.shopify.accessToken;
        const shop = await getShopByShopifyDomain(shopDomain);
        const shopify = new Shopify({
          shopName: shopDomain,
          accessToken: accessToken
        });
        await Promise.all([
          syncOrders(shopify, shop),
          createDefaultSettings(shop),
          registerWebhook(shopify),
          registerScripttags(shopify)
        ]);
      } catch (err) {
        console.error('afterInstall ERROR', err);
      }
    }
    // TODO: Handle login events
  }).routes()
);

// Handling all errors
app.on('error', err => {
  console.error(err);
});

export default app;
