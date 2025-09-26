import React, {useMemo, useState} from 'react';
import {Card, Layout, ResourceItem, ResourceList} from '@shopify/polaris';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';
import usePaginate from '@assets/hooks/api/usePaginate.js';
import {DeleteIcon} from '@shopify/polaris-icons';
import useDeleteApi from '@assets/hooks/api/useDeleteApi.js';

function NotificationsResourceList() {
  const {data, loading, pageInfo, nextPage, prevPage, refetch} = usePaginate({
    url: '/notifications'
  });
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [selectedItems, setSelectedItem] = useState([]);

  // Bulk delete hook
  const {deleting: bulkDeleting, handleDelete: handleBulkDelete} = useDeleteApi({
    url: '/notifications/delete',
    successCallback: () => {
      console.log('Bulk delete successful');
      setSelectedItem([]);
      refetch();
    }});

  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

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

  // Handle bulk delete
  const handleBulkDeleteAction = () => {
    if (selectedItems && selectedItems.length > 0) {
      console.log('Performing bulk delete for:', selectedItems);
      handleBulkDelete({
        data: selectedItems,
        id: ''
      });
    }
  };

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const promotedBulkActions = [
    {
      icon: DeleteIcon,
      destructive: true,
      content: `Delete ${selectedItems.length} notification(s)`,
      onAction: handleBulkDeleteAction,
      disabled: bulkDeleting || selectedItems.length === 0
    }
  ];

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
            onSelectionChange={(items) => {
              console.log('Selection changed:', items);
              setSelectedItem(items);
            }}
            selectable
            resourceName={resourceName}
            items={sortedData}
            loading={loading}
            promotedBulkActions={promotedBulkActions}
            renderItem={item => (
              <ResourceItem
                id={item.id}
              >
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
              hasPrevious: !!pageInfo?.hasPre
            }}
          />
        </Card>
      </Layout.Section>
    </Layout>
  );
}

export default NotificationsResourceList;
