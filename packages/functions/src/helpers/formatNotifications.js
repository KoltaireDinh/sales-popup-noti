/**
 * Formatted notifications
 * @param shop
 * @param order
 * @returns {{shopId, shopDomain, firstName: *, city: *, country: *, productName, productId, productImage: *, createdAt: Date}}
 */
export const formatNotifications = (shop, order) => {
  const customer = order.customer;
  const lineItem = order.lineItems?.edges?.[0]?.node;

  return {
    shopId: shop?.id,
    shopDomain: shop?.domain,
    firstName: customer?.firstName || 'Anonymous',
    city: customer?.defaultAddress?.city || 'Unknown City',
    country: customer?.defaultAddress?.country || 'Unknown Country',
    productName: lineItem?.title || 'Unknown Product',
    productId: lineItem?.product?.id,
    productImage: lineItem?.product?.images?.edges?.[0]?.node?.url || 'Unknown Image',
    createdAt: new Date(order?.createdAt)
  };
};

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
