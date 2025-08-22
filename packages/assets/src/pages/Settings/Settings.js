import React from 'react';
import {Layout, Page} from '@shopify/polaris';
import TabsDefaultExample from '@assets/components/TabsDefault/TabsDefaultExample.js';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';
import useFetchApi from '@assets/hooks/api/useFetchApi.js';
import defaultSettings from '@functions/const/defaultSettings.js';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';

/**
 * @return {JSX.Element}
 */
export default function Settings() {

  const {data: fetchedData, isSkeletonLoading} = useFetchApi({
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
          <NotificationPopup />
        </div>

        <Layout.Section>
          {isSkeletonLoading ? (
            <SkeletonLoadingPage></SkeletonLoadingPage>
          ) : (
            <TabsDefaultExample fetchData={fetchedData} />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
