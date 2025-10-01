import {BlockStack, Checkbox, Layout, RangeSlider, Text, TextField} from '@shopify/polaris';

import DesktopPositionInput from '../DesktopPositionInput/DesktopPositionInput.js';
import defaultSettings from '@functions/const/defaultSettings.js';

function DisplaySettingsTab({input, handleChangeInput}) {
  const settings = {...defaultSettings, ...input};
  return (
    <Layout>
      <Layout.Section>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h2" tone="strong">
            APPEARANCE
          </Text>
          <DesktopPositionInput
            label="Desktop position"
            value={settings.position}
            onChange={value => handleChangeInput('position', value)}
            helpText="The display position of the popup on your website."
          ></DesktopPositionInput>
          <Checkbox
            label="Hide time ago"
            checked={settings.hideTimeAgo}
            onChange={checked => handleChangeInput('hideTimeAgo', checked)}
          />
          <Checkbox
            label="Truncate content text"
            checked={settings.truncateProductName}
            onChange={checked => handleChangeInput('truncateProductName', checked)}
          />
          <Text variant="headingSm" as="h2" tone="strong">
            TIMING
          </Text>
          <Layout>
            <Layout.Section variant="oneHalf">
              <RangeSlider
                label="Display duration"
                min={1}
                max={10}
                step={1}
                value={settings.displayDuration}
                onChange={value => handleChangeInput('displayDuration', value)}
                output
                suffix={
                  <TextField
                    value={settings.displayDuration}
                    onChange={value => {
                      handleChangeInput('displayDuration', value);
                    }}
                    type="number"
                    min={1}
                    max={10}
                    autoComplete="off"
                    align="center"
                    suffix={'seconds'}
                  />
                }
              />

              <Text variant="bodyMd" tone="subdued">
                How long each pop will display on your page.
              </Text>
            </Layout.Section>
            <Layout.Section variant="oneHalf">
              <RangeSlider
                label="Time before the first pop"
                min={1}
                max={30}
                step={1}
                value={settings.firstDelay}
                onChange={value => handleChangeInput('firstDelay', value)}
                output
                suffix={
                  <TextField
                    value={settings.firstDelay}
                    onChange={value => {
                      handleChangeInput('firstDelay', value);
                    }}
                    type="number"
                    min={1}
                    max={30}
                    autoComplete="off"
                    align="center"
                    suffix={'seconds'}
                  />
                }
              />
              <Text variant="bodyMd" tone="subdued">
                The delay time before the first notification.
              </Text>
            </Layout.Section>
            <Layout.Section variant="oneHalf">
              <RangeSlider
                label="Gap time between two pops"
                min={1}
                max={10}
                step={1}
                value={settings.popsInterval}
                onChange={value => handleChangeInput('popsInterval', value)}
                output
                suffix={
                  <TextField
                    value={settings.popsInterval}
                    onChange={value => {
                      handleChangeInput('popsInterval', value);
                    }}
                    type="number"
                    min={1}
                    max={15}
                    autoComplete="off"
                    align="center"
                    suffix={'seconds'}
                  />
                }
              />
              <Text variant="bodyMd" tone="subdued">
                The time interval between two popup notifications.
              </Text>
            </Layout.Section>
            <Layout.Section variant="oneHalf">
              <RangeSlider
                label="Maximum of popups"
                min={1}
                max={30}
                step={1}
                value={settings.maxPopsDisplay}
                onChange={value => handleChangeInput('maxPopsDisplay', value)}
                output
                suffix={
                  <TextField
                    value={settings.maxPopsDisplay}
                    onChange={value => {
                      handleChangeInput('maxPopsDisplay', value);
                    }}
                    type="number"
                    min={1}
                    max={30}
                    autoComplete="off"
                    align="center"
                    suffix={'popups'}
                  />
                }
              />
              <Text variant="bodyMd" tone="subdued">
                The maximum number of popups allowed after page loading.
              </Text>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Layout.Section>
    </Layout>
  );
}

export default DisplaySettingsTab;
