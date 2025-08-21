import React, {useContext, useState} from 'react';
import {Frame, Layout, Loading, Scrollable, Toast} from '@shopify/polaris';
import PropTypes from 'prop-types';
import {useStore} from '@assets/reducers/storeReducer';
import {closeToast} from '@assets/actions/storeActions';
import AppTopBar from '@assets/layouts/AppLayout/AppTopBar';
import AppNavigation from '@assets/layouts/AppLayout/AppNavigation';
import {isEmbeddedApp} from '@assets/config/app';
import Footer from '@assets/components/Footer/Footer';
import {MaxModalContext} from '@assets/contexts/maxModalContext';

/**
 * Render an app layout
 *
 * @param {React.ReactNode} children
 * @return {React.ReactNode}
 * @constructor
 */
export default function AppFullLayout({children}) {
  const {isFullscreen} = useContext(MaxModalContext);
  const {state, dispatch} = useStore();
  const {loading, toast} = state;

  const [isNavOpen, setIsNavOpen] = useState(!isEmbeddedApp);
  const toggleOpenNav = () => setIsNavOpen(prev => !prev);

  const navigationClass = [
    'Avada-ScrollBar--isSubdued',
    'Avada-Frame__Navigation',
    !isFullscreen && isNavOpen && 'Avada-Frame__Navigation--isExpanded'
  ].filter(Boolean);

  const contentClass = [
    'Avada-Frame__Content',
    !isFullscreen && isNavOpen && 'Avada-Frame__Content--isExpanded'
  ].filter(Boolean);

  return (
    <Frame topBar={<AppTopBar {...{isNavOpen, toggleOpenNav}} />}>
      <div className="Avada-Frame">
        {!isFullscreen && (
          <div className={navigationClass.join(' ')}>
            <AppNavigation />
          </div>
        )}
        <Scrollable className={contentClass.join(' ')}>
          {children}
          <Layout>
            <Footer />
          </Layout>
        </Scrollable>
      </div>
      {loading && <Loading />}
      {toast && <Toast onDismiss={() => closeToast(dispatch)} {...toast} />}
    </Frame>
  );
}

AppFullLayout.propTypes = {
  children: PropTypes.node.isRequired
};
