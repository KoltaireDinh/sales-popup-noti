import React, {useState} from 'react';
import {Card, ResourceItem, ResourceList} from '@shopify/polaris';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';

function ResourceListWithSortingAndMultiSelect({ items = [] }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const renderItem = (item) => {
    const {id, firstName, city, country, productName, timestamp, productImage} = item;
    return (
      <ResourceItem id={id}>
        <NotificationPopup
          firstName={firstName}
          city={city}
          country={country}
          productName={productName}
          timestamp={timestamp}
          productImage={productImage}
        />
      </ResourceItem>
    );
  };

  return (
    <Card padding="0">
      <ResourceList
        resourceName={resourceName}
        items={items}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        renderItem={renderItem}
        selectable
        sortValue={sortValue}
        sortOptions={[
          {label: 'Newest update', value: 'DATE_MODIFIED_DESC'},
          {label: 'Oldest update', value: 'DATE_MODIFIED_ASC'}
        ]}
        pagination={{
          hasNext: true,
          onNext: () => {}
        }}
        onSortChange={selected => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
      />
    </Card>
  );
}

export default ResourceListWithSortingAndMultiSelect;
