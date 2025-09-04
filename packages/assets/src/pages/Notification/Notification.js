import React from 'react';
import { Layout, Page } from '@shopify/polaris';
import ResourceListWithSortingAndMultiSelect from '@assets/components/ResourceListWithSortingAndMultiSelect/ResourceListWithSortingAndMultiSelect';
import SkeletonLoadingPage from '@assets/components/SkeletonPage/SkeletonLoadingPage.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';

/**
 * @return {JSX.Element}
 */
export default function Notification() {
  const { loading: isSkeletonLoading } = usePaginate({
    url: '/notifications',
  });

  return (
    <Page fullWidth title="Notification" subtitle="List of sales notification from Shopify">
      {isSkeletonLoading ? (
        <SkeletonLoadingPage />
      ) : (
        <Layout sectioned>
          <ResourceListWithSortingAndMultiSelect />
        </Layout>
      )}
    </Page>
  );
}

Notification.propTypes = {};
