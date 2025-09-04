import React from 'react';

import {
  BlockStack,
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonTabs
} from '@shopify/polaris';

function SkeletonSettingsPage() {
  return (
    <Layout>
      <Layout.Section variant={'oneThird'}>
        <Card>
          <BlockStack>
            <SkeletonBodyText lines={3} />
          </BlockStack>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Card title="Timdsadasding" sectioned>
          <Layout.Section>
            <BlockStack gap={'600'}>
              <SkeletonTabs />
              <SkeletonBodyText lines={2} />
              <SkeletonDisplayText size={'extraLarge'} maxWidth={'65ch'} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={1} />
              <Layout>
                <Layout.Section variant={'oneHalf'}>
                    <SkeletonDisplayText size={'extraLarge'} maxWidth={'100%'} />
                </Layout.Section>
                <Layout.Section variant={'oneHalf'}>
                    <SkeletonDisplayText size={'extraLarge'} maxWidth={'100%'} />
                </Layout.Section>
                <Layout.Section variant={'oneHalf'}>
                    <SkeletonDisplayText size={'extraLarge'} maxWidth={'100%'} />
                </Layout.Section>
                <Layout.Section variant={'oneHalf'}>
                    <SkeletonDisplayText size={'extraLarge'} maxWidth={'100%'} />
                </Layout.Section>
              </Layout>
            </BlockStack>
          </Layout.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default SkeletonSettingsPage;
