// File: Notification.js

import React from 'react';
import {Layout, Page} from '@shopify/polaris';
import ResourceListWithSortingAndMultiSelect
  from '@assets/components/ResourceListWithSortingAndMultiSelect/ResourceListWithSortingAndMultiSelect';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';

/**
 * @return {JSX.Element}
 */
export default function Notification() {

  const {data: notifications, loading: isSkeletonLoading, pageInfo} = usePaginate({
    url: '/notification'
  });
  return (
    <Page fullWidth title="Notification" subtitle="List of sales notifcation from Shopify">
      {isSkeletonLoading ? (
        <SkeletonLoadingPage />
      ) : (
        <Layout sectioned>
          <ResourceListWithSortingAndMultiSelect
            notifications={notifications}
            pageInfo={pageInfo}
          />
        </Layout>
      )}
    </Page>
  );
}

Notification.propTypes = {};
