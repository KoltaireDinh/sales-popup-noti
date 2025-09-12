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
  registerWebhook,
  syncOrdersWithGraphQL
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
    // Handle post-installation tasks (sync 30 orders, setup shop data, register webhooks, create default settings)
    afterInstall: async ctx => {
      try {
        const shopifyDomain = ctx.state.shopify && ctx.state.shopify.shop;
        const accessToken = ctx.state.shopify && ctx.state.shopify.accessToken;
        if (!shopifyDomain || !accessToken) {
          ctx.status = 422;
          ctx.body = {
            success: false,
            message: 'Missing shopifyDomain or accessToken',
            shopifyDomain,
            accessToken
          };
          console.error('afterInstall ERROR - Missing credentials', {shopifyDomain, accessToken});
          return;
        }
        const shopify = new Shopify({
          shopName: shopifyDomain,
          accessToken: accessToken
        });
        console.log('After Install Triggered:', {shopifyDomain, accessToken});

        const shopData = await getShopByShopifyDomain(shopifyDomain, accessToken);
        if (!shopData || !shopData.id) {
          ctx.status = 422;
          ctx.body = {
            success: false,
            message: 'Shop not found or missing shopData.id',
            shopifyDomain,
            shopData
          };
          console.error('afterInstall ERROR - Shop data problem', {shopifyDomain, shopData});
          return;
        }
        console.log('Fetched shop data:', shopData);

        await Promise.all([
          // Sync existing orders to populate initial notifications
          syncOrdersWithGraphQL({
            shopDomain: shopifyDomain,
            accessToken: accessToken
          }),
          // Create default settings for the shop
          createDefaultSettings({shopId: shopData.id, shopDomain: shopifyDomain}),
          // Register webhook to listen for new orders
          registerWebhook(shopify)
          /*  registerOrderWebhookGraphQL({
            shopDomain: shopifyDomain,
            accessToken: accessToken,
            baseUrl: appConfig.baseUrl
          })*/
        ]);

        console.log('Successfully completed all post-installation tasks for:', shopifyDomain);
      } catch (err) {
        ctx.status = 422;
        ctx.body = {
          success: false,
          message: 'afterInstall ERROR',
          error: (err && err.message) || err,
          stack: err && err.stack
        };
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
