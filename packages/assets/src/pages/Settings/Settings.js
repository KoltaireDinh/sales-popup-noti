import React from 'react';

import {Layout, Page} from '@shopify/polaris';
import defaultSettings from '@functions/const/defaultSettings.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';
import SettingsSkeleton from '@assets/components/SkeletonComponents/SettingsSkeleton.js';
import TabsContainer from '@assets/components/TabsDefault/TabsContainer.js';

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
        ></div>
        <Layout.Section>
          {loading ? (
            <SettingsSkeleton />
          ) : (
            <TabsContainer loading={loading} fetchData={settings} />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
