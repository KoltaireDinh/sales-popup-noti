import App from './App';
import React from 'react';
import './styles/app.scss';
import {createRoot} from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import {api, auth} from './helpers';
import {StoreProvider} from '@assets/reducers/storeReducer';
import {collectActiveShopData} from '@assets/services/shopService';
import '@shopify/polaris/build/esm/styles.css';

window.isAuthenticated = false;

auth.onAuthStateChanged(async user => {
  const container = document.getElementById('app');
  const root = createRoot(container);

  if (user === null && !window.isAuthenticated) {
    window.location.href = 'auth/login';
    root.render(<div />);
  } else {
    window.isAuthenticated = true;

    const [{shop, shopInfo}, firebaseUser] = await Promise.all([
      api('/shops'),
      auth.currentUser.getIdTokenResult()
    ]);
    const activeShop = {
      ...firebaseUser.claims,
      vendor: firebaseUser.claims.type || 'others',
      ...collectActiveShopData({shop, shopInfo})
    };
    // if (activeShop) {
    //   TagManager.initialize({gtmId: 'GTM_ID'});
    //   if (!activeShop.isCrmLogin) {
    //     loadCrisp('WEBSITE_ID', shop.crispSessionToken);
    //     pushDataToCrisp({shopData: activeShop, user});
    //   }
    // }

    const loading = document.getElementById('PreLoading');
    if (loading !== null) {
      loading.style.display = 'none';
    }

    root.render(
      <StoreProvider {...{user, activeShop}}>
        <App />
      </StoreProvider>
    );
  }
});

// Register a service worker for PWA application
serviceWorker.register();
