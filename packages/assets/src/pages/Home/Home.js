import React, {useState} from 'react';
import {BlockStack, Button, Card, InlineStack, Layout, Page, Text} from '@shopify/polaris';

/**
 * Render a home page for overview
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function Home() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Page fullWidth title="Home">
      <BlockStack>
        <Card>
          <InlineStack blockAlign="center">
            <Text as="span">
              App status is <strong>{enabled ? 'Enabled' : 'Disabled'}</strong>
            </Text>
            <div style={{flex: 1}} />
            <Button
              size="large"
              variant={'primary'}
              tone={enabled ? 'success' : 'critical'}
              onClick={() => setEnabled(prev => !prev)}
            >
              {enabled ? 'Disable' : 'Enable'}
            </Button>
          </InlineStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
