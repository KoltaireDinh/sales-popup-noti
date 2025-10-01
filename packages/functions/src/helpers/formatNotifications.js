
import moment from 'moment';

/**
 * Formatted notifications
 * @param shop
 * @param order
 * @param productImageMap
 * @returns {{shopId, shopDomain, firstName: *, city: *, country: *, productName, productId, productImage: *, createdAt: Date}}
 */

export function formatNotification(shop, order, productImageMap) {
  try {
    const isGraphQL = order?.lineItems;
    const customer = isGraphQL ? order?.customer : order?.customer
    const lineItem = isGraphQL ? order?.lineItems?.edges[0]?.node : order?.line_items?.[0];

    const firstName = customer?.firstName || customer?.first_name || 'Anonymous';
    const city = customer?.defaultAddress?.city || customer?.city || 'Unknown City';
    const country = customer?.defaultAddress?.country || customer?.country || 'Unknown Country';
    const createdAt = order?.createdAt || order?.created_at;

    let productName = 'Unknown Product';
    let productId = 'Unknown Product';
    let productImage = 'Unknown Image';

    if (lineItem) {
      productName = lineItem.title || productName;
      productId = isGraphQL ? lineItem.product?.id : lineItem.product_id;
      if (isGraphQL) {
        productImage = lineItem.product?.images?.edges?.[0]?.node?.url || productImage;
      } else {
        productImage = productImageMap.get(lineItem.product_id) || productImage;
      }
    }

    return {
      shopId: shop?.id,
      shopDomain: shop?.shopifyDomain || 'Unknown',
      firstName,
      city,
      country,
      productName,
      productId,
      productImage,
      createdAt: createdAt ? new Date(createdAt) : null,
      relativeDate: createdAt ? moment(createdAt).fromNow() : null
    };
  } catch (error) {
    console.log('Error: ', error);
  }

}
