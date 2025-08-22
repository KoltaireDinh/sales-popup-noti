import React, {useCallback, useEffect, useState} from 'react';

import useFetchApi from '@assets/hooks/api/useFetchApi.js';
import useEditApi from '@assets/hooks/api/useEditApi.js';
import defaultSettings from '@functions/const/defaultSettings.js';
import {Button, Card, LegacyTabs, SkeletonPage} from '@shopify/polaris';
import DisplaySettingsTab from '@assets/components/DisplaySettingsTab/DisplaySettingsTab.js';
import TriggerSettingsTab from '@assets/components/TriggerSettingsTabs/TriggerSettingsTab.js';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';


function TabsDefaultExample() {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);
  const [isSkeletonLoading, setSkeletonLoading] = useState(true);

  const {data: fetchedData} = useFetchApi({
    url: '/settings',
    defaultSettings
  });

  const {handleEdit, loading: saving} = useEditApi({
    url: '/settings'
  });

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (fetchedData) {
      setSettings(fetchedData);
      setSkeletonLoading(false);
    }
  }, [fetchedData]);


  const handleSave = async () => {
    console.log('Saving settings with the following data:', settings);
    try {
      setSkeletonLoading(true);
      const result = await handleEdit(settings);

      if (result) {
        setSettings(settings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSkeletonLoading(false);
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
    <>
      {isSkeletonLoading ? (
        <SkeletonLoadingPage></SkeletonLoadingPage>
      ) : (
        <Card style={{width: '100%'}}>
          <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            {renderTabContent()}
          </LegacyTabs>
            <Button primary loading={saving} onClick={handleSave}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
        </Card>
      )}
    </>
  );
}

export default TabsDefaultExample;
