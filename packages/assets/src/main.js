import React from 'react';
import ReactDOM from 'react-dom/client';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, LegacyCard, Button} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

const loading = document.getElementById('PreLoading');
if (loading !== null) {
  loading.style.display = 'none';
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <AppProvider i18n={enTranslations}>
      <Page title="Example app">
        <LegacyCard sectioned>
          <Button onClick={() => alert('Button clicked!')}>Example button 657</Button>
        </LegacyCard>
      </Page>
    </AppProvider>
  </React.StrictMode>
);
