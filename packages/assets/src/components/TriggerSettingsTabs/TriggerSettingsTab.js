import {BlockStack, Layout, Text, TextField} from '@shopify/polaris';

import SelectExample from '@assets/components/SelectExample/SelectExample.js';
import {value} from 'firebase-tools/lib/deploymentTool.js';
import defaultSettings from '@functions/const/defaultSettings.js';

function TriggerSettingsTab({input, handleChangeInput}) {
  const settings = {...defaultSettings, ...input};

  return (
    <Layout>
      <Layout.Section>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h2" tone="strong">
            RESTRICTIONS
          </Text>
          <Layout>
            <Layout.Section>
              <BlockStack gap="400">
                <SelectExample
                  onChange={value => handleChangeInput('allowShow', value)}
                  value={settings.allowShow}
                />

                {settings.allowShow === 'specific' && (
                  <TextField
                    size="large"
                    multiline={6}
                    label="Included pages"
                    value={settings.includedUrls}
                    onChange={value => handleChangeInput('includedUrls', value)}
                    helpText="Page URLs to show the pop-up (separated by new lines)"
                    autoComplete="email"
                  />
                )}
                <TextField
                  size="large"
                  multiline={6}
                  label="Excluded pages"
                  value={settings.excludedUrls}
                  onChange={value => handleChangeInput('excludedUrls', value)}
                  helpText="Pages URLs NOT to show the pop-up (separated by new lines)"
                  autoComplete="email"
                />
              </BlockStack>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Layout.Section>
    </Layout>
  );
}

export default TriggerSettingsTab;
