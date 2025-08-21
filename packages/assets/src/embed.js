import App from './App';
import React from 'react';
import './styles/app.scss';
import {api} from './helpers';
import {StoreProvider} from '@assets/reducers/storeReducer';
import {collectActiveShopData} from '@assets/services/shopService';
import {createRoot} from 'react-dom/client';
import '@shopify/polaris/build/esm/styles.css';

(async () => {
  let activeShop = null;
  let user = null;

  try {
    // Try to fetch shop data
    const {shop, shopInfo} = await api('/shops');
    activeShop = collectActiveShopData({shop, shopInfo});
    user = {email: shop.email, displayName: shopInfo.shopOwner};

    // if (activeShop) {
    //   loadCrisp('WEBSITE_ID', shop.crispSessionToken);
    //   pushDataToCrisp({shopData: activeShop, user});
    // }
  } catch (error) {
    console.error('Failed to load shop data:', error);

    // Provide fallback data or handle the error gracefully
    activeShop = null;
    user = {email: 'unknown@example.com', displayName: 'Unknown User'};

    // Optionally show a user-friendly error message
    // You could set a flag here to show an error banner in your app
  }

  // Hide loading screen regardless of API success/failure
  const loading = document.getElementById('PreLoading');
  if (loading !== null) {
    loading.style.display = 'none';
  }

  // Always render the app, even if shop data failed to load
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(
    <StoreProvider {...{user, activeShop}}>
      <App />
    </StoreProvider>
  );
})();
