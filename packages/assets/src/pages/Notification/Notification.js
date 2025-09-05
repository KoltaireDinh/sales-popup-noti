import React from 'react';
import {Layout, Page} from '@shopify/polaris';
import NotificationsResourceList from '@assets/components/ResourceListWithSortingAndMultiSelect/NotificationsResourceList.js';
import NotificationsSkeleton from '@assets/components/SkeletonComponents/NotificationsSkeleton.js';
import useFetchApi from '@assets/hooks/api/useFetchApi.js';

/**
 * @return {JSX.Element}
 */
export default function Notification() {
  const {loading: isSkeletonLoading} = useFetchApi({
    url: '/notifications'
  });


  return (
    <Page fullWidth title="Notification" subtitle="List of sales notification from Shopify">
      {isSkeletonLoading ? (
        <NotificationsSkeleton />
      ) : (
        <Layout sectioned>
          <NotificationsResourceList />
        </Layout>
      )}
    </Page>
  );
}

Notification.propTypes = {};
