import React, {useEffect, useState} from 'react';

import {Button, Frame, Layout, Page} from '@shopify/polaris';
import defaultSettings from '@functions/const/defaultSettings.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';
import SettingsSkeleton from '@assets/components/SkeletonComponents/SettingsSkeleton.js';
import TabsContainer from '@assets/components/TabsDefault/TabsContainer.js';
import useEditApi from '@assets/hooks/api/useEditApi.js';

/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const {data: settings, loading} = usePaginate({
    url: '/settings',
    defaultSettings
  });
  const {handleEdit, editing} = useEditApi({
    url: '/settings'
  });

  const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings);

  useEffect(() => {
    if (settings) {
      setCurrentSettings(settings);
    }
  }, [settings]);

  const handleSettingsChange = newSettings => {
    setCurrentSettings(newSettings);
  };

  const handleSave = async () => {
    console.log('Saving settings with the following data:', currentSettings);
    try {
      const result = await handleEdit(currentSettings);

      if (result) {
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  return (
      <Page
        backAction={{content: 'Products', url: '#'}}
        title="Settings"
        subtitle="Decide how your notifications will display"
        primaryAction={
          <Button
            primary
            loading={editing}
            onClick={handleSave}
            size={'large'}
            variant={'primary'}
            tone={'success'}
          >
            Save
          </Button>
        }
      >
        {loading ? (
          <Layout>
            <Layout.Section>
              <SettingsSkeleton />
            </Layout.Section>
          </Layout>
        ) : (
          <TabsContainer
            loading={loading}
            fetchData={settings}
            onSettingsChange={handleSettingsChange}
            editing={editing}
          />
        )}
      </Page>
  );
}

Settings.propTypes = {};
