import {formatDate} from '@avada/utils';
import moment from 'moment';
import {Timestamp} from '@google-cloud/firestore/build/src';

/**
 * Formatted notifications
 * @param shop
 * @param order
 * @returns {{shopId, shopDomain, firstName: *, city: *, country: *, productName, productId, productImage: *, createdAt: Date}}
 */
export function formatNotifications(shop, order) {
  const customer = order?.customer;
  const lineItem = order?.lineItems?.edges?.[0]?.node;
  const createdAt = order?.createdAt;
  const relativeDate = moment(createdAt);
  return {
    shopId: shop?.id,
    shopDomain: shop?.shopifyDomain || 'Unknown',
    firstName: customer?.firstName || 'Anonymous',
    city: customer?.defaultAddress?.city || 'Unknown City',
    country: customer?.defaultAddress?.country || 'Unknown Country',
    productName: lineItem?.title || 'Unknown Product',
    productId: lineItem?.product?.id || 'Unknown Product',
    productImage: lineItem?.product?.images?.edges?.[0]?.node?.url || 'Unknown Image',
    createdAt: new Date(createdAt).toISOString(),
    relativeDate: relativeDate.fromNow()
  };
}
