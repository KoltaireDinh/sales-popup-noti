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
  return {
    shopId: shop?.id,
    shopDomain: shop?.shopifyDomain || 'Unknown',
    firstName: customer?.firstName || 'Anonymous',
    city: customer?.defaultAddress?.city || 'Unknown City',
    country: customer?.defaultAddress?.country || 'Unknown Country',
    productName: lineItem?.title || 'Unknown Product',
    productId: lineItem?.product?.id || 'Unknown Product',
    productImage: lineItem?.product?.images?.edges?.[0]?.node?.url || 'Unknown Image',
    createdAt: createdAt && !isNaN(new Date(createdAt)) ? new Date(createdAt) : new Date()
  };
}

/*
    const order = ordersList[i];
    const node = order.node;
    const customer = node.customer;
    const lineItem = node.lineItems?.edges?.[0]?.node;
    const productImage = lineItem?.product?.images?.edges?.[0]?.node?.url;

    const notification = {
      shopDomain: shopDomain,
      firstName: customer?.firstName || 'Anonymous',
      city: customer?.defaultAddress?.city || 'Unknown',
      country: customer?.defaultAddress?.country || 'Unknown',
      productId: lineItem?.product?.id || node.id,
      productImage: productImage || '',
      productName: lineItem?.title || 'Unknown Product',
      timestamp: new Date(node.createdAt)
    };
 */
