import React, {useCallback, useEffect, useState} from 'react';
import useEditApi from '@assets/hooks/api/useEditApi.js';
import defaultSettings from '@functions/const/defaultSettings.js';
import {Button, Card, LegacyTabs} from '@shopify/polaris';
import DisplaySettingsTab from '@assets/components/DisplaySettingsTab/DisplaySettingsTab.js';
import TriggerSettingsTab from '@assets/components/TriggerSettingsTabs/TriggerSettingsTab.js';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';

function TabsDefaultExample({fetchData}) {
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(fetchData || defaultSettings);

  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);

  const {handleEdit, loading: saving} = useEditApi({
    url: '/settings'
  });

  // Update settings when fetchData prop changes
  useEffect(() => {
    if (fetchData) {
      setSettings(fetchData);
    }
  }, [fetchData]);

  const handleSave = async () => {
    console.log('Saving settings with the following data:', settings);
    try {
      setIsLoading(true);
      const result = await handleEdit(settings);

      if (result) {
        // Settings successfully saved
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.log('Error saving settings:', error);
    } finally {
      setIsLoading(false);
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

  // Show loading during save operation
  if (isLoading) {
    return <SkeletonLoadingPage />;
  }

  return (
    <Card style={{width: '100%'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'end',
        }}
      >
        <Button primary loading={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
      <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted={false} />

      <div style={{padding: '16px'}}>{renderTabContent()}</div>
    </Card>
  );
}

export default TabsDefaultExample;
