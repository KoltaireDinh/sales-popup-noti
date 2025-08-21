import React from 'react';
import {BlockStack, Card, Layout, Text} from '@shopify/polaris';

/**
 * @return {JSX.Element}
 */
export default function DefaultTable() {
  return (
    <Layout sectioned>
      <BlockStack gap="400">
        <Card>
          <Text as="span">Table 1</Text>
        </Card>
      </BlockStack>
    </Layout>
  );
}
