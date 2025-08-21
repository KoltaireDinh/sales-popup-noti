import {Card, LegacyTabs} from '@shopify/polaris';
import {useCallback, useState} from 'react';
import DisplaySettingsTab from '../DisplaySettingsTab/DisplaySettingsTab.js';
import TriggerSettingsTab from '../TriggerSettingsTabs/TriggerSettingsTab.js';
import useFetchApi from '@assets/hooks/api/useFetchApi.js';
import useEditApi from '@assets/hooks/api/useEditApi.js';
import defaultSettings from '@functions/const/defaultSettings.js';

function TabsDefaultExample() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(selectedTabIndex => setSelected(selectedTabIndex), []);

  const { data: input, setData: setInput} = useFetchApi({
    url: '/settings',
    defaultData: defaultSettings
  });

  const {handleEdit: saveSettings} = useEditApi({
    url: '/settings'
  });

  const handleChangeInput = (key, value) => {
    setInput(prev => ({...prev, [key]: value}));
  };

  const tabs = [
    {id: 'display-01', content: 'Display'},
    {id: 'trigger-01', content: 'Trigger'}
  ];

  return (
    <Card style={{width: '100%'}}>
      <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        {tabs[selected].id === 'display-01' && (
          <DisplaySettingsTab
            input={input}
            handleChangeInput={handleChangeInput}
          />
        )}
        {tabs[selected].id === 'trigger-01' && (
          <TriggerSettingsTab
            input={input}
            handleChangeInput={handleChangeInput}
          />
        )}
      </LegacyTabs>
    </Card>
  );
}

export default TabsDefaultExample;
