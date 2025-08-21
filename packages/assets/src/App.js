import React from 'react';
import {Router} from 'react-router-dom';
import ReactRouterLink from '@assets/components/ReactRouterLink/ReactRouterLink';
import {AppProvider} from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import {history} from '@assets/history';
import ErrorBoundary from '@assets/components/ErrorBoundary';
import Routes from './routes/routes';
import PropTypes from 'prop-types';
import AppBridgeProvider from '@assets/components/AppBridgeProvider';
import {isEmbeddedApp} from '@assets/config/app';
import AppEmbeddedLayout from '@assets/layouts/EmbeddedLayout/AppEmbeddedLayout';
import AppFullLayout from '@assets/layouts/FullLayout/AppFullLayout';
import {MaxModalProvider} from '@assets/contexts/maxModalContext';

/**
 * The main endpoint of application contains all routes, settings for redux and Polaris
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function App() {
  return (
    <AppProvider i18n={translations} linkComponent={ReactRouterLink}>
      <Router history={history}>
        <MaxModalProvider>
          <MainLayout>
            <ErrorBoundary>
              <Routes />
            </ErrorBoundary>
          </MainLayout>
        </MaxModalProvider>
      </Router>
    </AppProvider>
  );
}

const MainLayout = ({children}) => {
  return isEmbeddedApp ? (
    <AppBridgeProvider>
      <AppEmbeddedLayout>{children}</AppEmbeddedLayout>
    </AppBridgeProvider>
  ) : (
    <AppFullLayout>{children}</AppFullLayout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};
