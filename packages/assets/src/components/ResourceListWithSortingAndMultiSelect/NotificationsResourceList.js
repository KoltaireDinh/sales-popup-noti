import React, {useMemo, useState} from 'react';

import {Card, Layout, ResourceItem, ResourceList} from '@shopify/polaris';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';

import usePaginate from '@assets/hooks/api/usePaginate.js';

function NotificationsResourceList() {
  const {data, loading, pageInfo, nextPage, prevPage} = usePaginate({
    url: '/notifications'
  });
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');

  const sortedData = useMemo(() => {
    console.log('Sorting notifications...');
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortValue === 'DATE_MODIFIED_DESC') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }, [data, sortValue]);

  const [selectedItems, setSelectedItem] = useState([]);

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  return (
    <Layout>
      <Layout.Section>
        <Card padding="0">
          <ResourceList
            sortValue={sortValue}
            sortOptions={[
              {label: 'Newest update', value: 'DATE_MODIFIED_DESC'},
              {label: 'Oldest update', value: 'DATE_MODIFIED_ASC'}
            ]}
            onSortChange={selected => {
              setSortValue(selected);
            }}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItem}
            selectable
            resourceName={resourceName}
            items={sortedData}
            loading={loading}
            renderItem={item => (
              <ResourceItem id={item.id}>
                <NotificationPopup
                  firstName={item.firstName}
                  city={item.city}
                  country={item.country}
                  productName={item.productName}
                  productImage={item.productImage}
                  timestamp={item.createdAt}
                />
              </ResourceItem>
            )}
            pagination={{
              onNext: nextPage,
              onPrevious: prevPage,
              hasNext: !!pageInfo?.hasNext,
              hasPrevious: !!pageInfo?.hasPre,
            }}
          />
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default NotificationsResourceList;
