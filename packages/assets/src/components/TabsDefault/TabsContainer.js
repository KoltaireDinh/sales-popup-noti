import React, {useCallback, useState} from 'react';
import useEditApi from '@assets/hooks/api/useEditApi.js';
import defaultSettings from '@functions/const/defaultSettings.js';
import {Button, Card, InlineStack, Layout, Tabs} from '@shopify/polaris';
import DisplaySettingsTab from '@assets/components/DisplaySettingsTab/DisplaySettingsTab.js';
import TriggerSettingsTab from '@assets/components/TriggerSettingsTabs/TriggerSettingsTab.js';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';
import * as Icon from '@shopify/polaris-icons';


function TabsContainer({fetchData}) {
  const [selected, setSelected] = useState(0);
  const [settings, setSettings] = useState(fetchData || defaultSettings);

  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);

  const {handleEdit, editing} = useEditApi({
    url: '/settings'
  });

  const handleSave = async () => {
    console.log('Saving settings with the following data:', settings);
    try {
      const result = await handleEdit(settings);

      if (result) {
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const handleChangeInput = (key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
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
      <div style={{marginTop: '1rem', marginLeft: '1rem'}}>
        <NotificationPopup settings={settings} />
      </div>

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
            <Button
              primary
              loading={editing}
              onClick={handleSave}
              size={'medium'}
              variant={'primary'}
              tone={'success'}
            >
              Save Settings
            </Button>
          </InlineStack>
          <Layout.Section>{renderTabContent()}</Layout.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default TabsContainer;
