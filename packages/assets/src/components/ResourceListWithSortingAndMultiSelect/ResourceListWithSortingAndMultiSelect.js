import React from 'react';
import {Card, ResourceItem, ResourceList} from '@shopify/polaris';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';
import useFetchApi from '@assets/hooks/api/useFetchApi.js';

function ResourceListWithSortingAndMultiSelect() {
  const {data, loading, pageInfo, nextPage, prevPage} = useFetchApi({
    url: '/notifications'
  });

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  return (
    <Card padding="0">
      <ResourceList
        resourceName={resourceName}
        items={data}
        loading={loading}
        renderItem={item => (
          <ResourceItem id={item.id}>
            <NotificationPopup
              firstName={item.firstName}
              city={item.city}
              country={item.country}
              productName={item.productName}
              productImage={item.productImage}
              createdAt={item.createdAt}
            />
          </ResourceItem>
        )}
        pagination={{
          onNext: nextPage,
          onPrevious: prevPage,
          hasNext: !!pageInfo?.hasNext,
          hasPrevious: !!pageInfo?.hasPrevious
        }}
      />
    </Card>
  );
}

export default ResourceListWithSortingAndMultiSelect;
