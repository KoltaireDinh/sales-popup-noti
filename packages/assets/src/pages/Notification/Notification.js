import React from 'react';
import {Layout, Page} from '@shopify/polaris';
import NotificationsResourceList from '@assets/components/ResourceListWithSortingAndMultiSelect/NotificationsResourceList.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';
import SettingsSkeleton from '@assets/components/SkeletonComponents/SettingsSkeleton.js';

/**
 * @return {JSX.Element}
 */
export default function Notification() {
  const {loading: isSkeletonLoading} = usePaginate({
    url: '/notifications'
  });

  return (
    <Page fullWidth title="Notification" subtitle="List of sales notification from Shopify">
      {isSkeletonLoading ? (
        <SettingsSkeleton />
      ) : (
        <Layout sectioned>
          <NotificationsResourceList />
        </Layout>
      )}
    </Page>
  );
}

Notification.propTypes = {};
