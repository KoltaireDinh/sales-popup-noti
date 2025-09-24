import React, {useCallback, useState} from 'react';
import defaultSettings from '@functions/const/defaultSettings.js';
import {Card, InlineStack, Layout, Tabs} from '@shopify/polaris';
import DisplaySettingsTab from '@assets/components/DisplaySettingsTab/DisplaySettingsTab.js';
import TriggerSettingsTab from '@assets/components/TriggerSettingsTabs/TriggerSettingsTab.js';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';

function TabsContainer({fetchData, onSettingsChange, editing}) {
  const [selected, setSelected] = useState(0);
  const [settings, setSettings] = useState(fetchData || defaultSettings);

  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);

  const handleChangeInput = (key, value) => {
    const newSettings = {...settings, [key]: value};
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const tabs = [
    {
      id: 'display-01',
      content: 'Display',
      body: <DisplaySettingsTab input={settings} handleChangeInput={handleChangeInput} />
    },
    {
      id: 'trigger-01',
      content: 'Trigger',
      body: <TriggerSettingsTab input={settings} handleChangeInput={handleChangeInput} />
    }
  ];

  const renderTabContent = () => {
    return tabs[selected].body;
  };
  return (
    <Layout>
      <Layout.Section variant={'oneThird'}>
        <NotificationPopup settings={settings} />
      </Layout.Section>

      <Layout.Section>
        <Card>
          <InlineStack align={'space-between'}>
            <Tabs
              fitted={true}
              tabs={tabs}
              selected={selected}
              onSelect={handleTabChange}
              loading={editing}
            />
          </InlineStack>
          <Layout.Section>{renderTabContent()}</Layout.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default TabsContainer;
