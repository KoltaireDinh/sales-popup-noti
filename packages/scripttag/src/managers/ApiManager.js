import makeRequest from '../helpers/api/makeRequest';

export default class ApiManager {
  getNotifications = async () => {
    return this.getApiData();
  };

  getApiData = async () => {
    const shopifyDomain = window.Shopify.shop;
    const {notifications, settings} = await makeRequest(
      `http://localhost:5000/clientApi/notifications?shopDomain=${shopifyDomain}`
    );

    return {notifications, settings};
  };
}
