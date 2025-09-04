import React, {useCallback, useState} from 'react';
import useEditApi from '@assets/hooks/api/useEditApi.js';
import defaultSettings from '@functions/const/defaultSettings.js';
import {Button, Card, InlineStack, Layout, Tabs} from '@shopify/polaris';
import DisplaySettingsTab from '@assets/components/DisplaySettingsTab/DisplaySettingsTab.js';
import TriggerSettingsTab from '@assets/components/TriggerSettingsTabs/TriggerSettingsTab.js';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';


function TabsDefaultExample({fetchData}) {
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
    {id: 'display-01', content: 'Display'},
    {id: 'trigger-01', content: 'Trigger'}
  ];

  const renderTabContent = () => {
    switch (tabs[selected].id) {
      case 'display-01':
        return <DisplaySettingsTab input={settings} handleChangeInput={handleChangeInput} />;
      case 'trigger-01':
        return <TriggerSettingsTab input={settings} handleChangeInput={handleChangeInput} />;
      default:
        return null;
    }
  };
  return (
    <Layout>
      <div
      style={{marginTop: '1rem', marginLeft: '1rem'}}>
        <NotificationPopup />
      </div>

      <Layout.Section>
        <Card>
          <InlineStack align={'space-between'}>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
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
          {editing ? (
            <SkeletonLoadingPage />
          ) : (
            <div style={{padding: '16px'}}>{renderTabContent()}</div>
          )}
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default TabsDefaultExample;
