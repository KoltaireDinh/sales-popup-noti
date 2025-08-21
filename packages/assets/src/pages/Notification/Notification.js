import React from 'react';
import {Layout, Page} from '@shopify/polaris';
import ResourceListWithSortingAndMultiSelect
  from '@assets/components/ResourceListWithSortingAndMultiSelect/ResourceListWithSortingAndMultiSelect';

/**
 * @return {JSX.Element}
 */
export default function Notification() {
  return (
    <Page fullWidth title="Notification" subtitle="List of sales notifcation from Shopify">
      <Layout sectioned>
        <ResourceListWithSortingAndMultiSelect></ResourceListWithSortingAndMultiSelect>
      </Layout>
    </Page>
  );
}

Notification.propTypes = {};
