import React from 'react';

import {Button, Layout, Page} from '@shopify/polaris';
import TabsDefaultExample from '@assets/components/TabsDefault/TabsDefaultExample.js';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';
import defaultSettings from '@functions/const/defaultSettings.js';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {data: settings, isSkeletonLoading} = usePaginate({
    url: '/settings',
    defaultSettings
  });

  return (
    <Page
      fullWidth={true}
      title="Settings"
      subtitle="Decide how your notifications will display"
    >
      {isSkeletonLoading ? (
        <SkeletonLoadingPage />
      ) : (
        <Layout>
          <div
            style={{
              marginTop: '15px'
            }}
          >
            <NotificationPopup />
          </div>

          <Layout.Section>
            <TabsDefaultExample fetchData={settings} />
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
}

Settings.propTypes = {};
