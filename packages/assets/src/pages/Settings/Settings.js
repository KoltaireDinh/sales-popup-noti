import React from 'react';

import {Layout, Page} from '@shopify/polaris';
import TabsDefaultExample from '@assets/components/TabsDefault/TabsDefaultExample.js';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';
import defaultSettings from '@functions/const/defaultSettings.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {data: settings, loading} = usePaginate({
    url: '/settings',
    defaultSettings
  });

  return (
    <Page fullWidth={true} title="Settings" subtitle="Decide how your notifications will display">
      <Layout>
        <div
          style={{
            marginTop: '15px'
          }}
        >
        </div>

        <Layout.Section>
          {loading ? (
            <SkeletonLoadingPage />
          ) : (
            <TabsDefaultExample loading={loading} fetchData={settings} />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
