import {BlockStack, Layout, Text, TextField} from '@shopify/polaris';
import SelectExample from '@assets/components/SelectExample/SelectExample.js';
import HelpTextField from '@assets/components/HelpTextField/HelpTextField.js';
import SettingsCard from '@assets/components/SettingsCard/SettingsCard.js';
import {value} from 'firebase-tools/lib/deploymentTool.js';
import defaultSettings from '@functions/const/defaultSettings.js';

function TriggerSettingsTab({input, handleChangeInput}) {
  const settings = {...defaultSettings, ...input};

  return (
    <SettingsCard>
      <div style={{marginTop: '15px'}}>
        <Text variant="headingSm" as="h2" tone="strong">
          PAGES RESTRICTION
        </Text>
      </div>

      <div style={{marginTop: '20px'}}>
        <Layout>
          <Layout.Section>
            <BlockStack gap="200">
              <SelectExample onChange={(value) => handleChangeInput('allowShow', value)} value={settings.allowShow} />

              {settings.allowShow === 'specific' && (
                <TextField
                  size="slim"
                  multiline
                  label="Included pages"
                  value={settings.includedUrls}
                  onChange={(value) => handleChangeInput('includedUrls', value)}
                  helpText="Page URLs to show the pop-up (separated by new lines)"
                />
              )}
            </BlockStack>
          </Layout.Section>

          <Layout.Section>
            <BlockStack gap="200">
              <HelpTextField />
            </BlockStack>
          </Layout.Section>
        </Layout>
      </div>
    </SettingsCard>
  );
}

export default TriggerSettingsTab;
