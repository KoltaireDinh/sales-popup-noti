import React from 'react';
import {Layout, Page} from '@shopify/polaris';
import TabsDefaultExample from '@assets/components/TabsDefault/TabsDefaultExample.js';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  return (
    <Page fullWidth={true} title="Settings" subtitle="Decide how your notifications will display">
      <Layout>
        <div
          style={{
            marginTop: '15px'
          }}
        >
          <NotificationPopup></NotificationPopup>
        </div>

        <Layout.Section>
          <TabsDefaultExample />
        </Layout.Section>
      </Layout>
    </Page>
  );
}

Settings.propTypes = {};
