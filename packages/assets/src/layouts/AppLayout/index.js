import React, {useState} from 'react';
import {Frame} from '@shopify/polaris';
import AppTopBar from '@assets/layouts/AppLayout/AppTopBar';
import AppNavigation from '@assets/layouts/AppLayout/AppNavigation';

// eslint-disable-next-line react/prop-types
export default function AppLayout({children}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleOpenNav = () => setIsNavOpen(prev => !prev);

  return (
    <Frame
      topBar={<AppTopBar isNavOpen={isNavOpen} toggleOpenNav={toggleOpenNav} />}
      navigation={<AppNavigation />}
      showMobileNavigation={isNavOpen}
      onNavigationDismiss={() => setIsNavOpen(false)}
    >
      {children}
    </Frame>
  );
}
