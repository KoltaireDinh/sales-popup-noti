import React from 'react';

import {BlockStack, Card, Layout, SkeletonBodyText} from '@shopify/polaris';

function SkeletonSettingsPage() {
  return (
    <Layout>
      <Layout.Section>
        <Card>
          <BlockStack gap={'400'}>
            <SkeletonBodyText lines={2} />
            <SkeletonBodyText lines={2} />
          </BlockStack>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default SkeletonSettingsPage;
