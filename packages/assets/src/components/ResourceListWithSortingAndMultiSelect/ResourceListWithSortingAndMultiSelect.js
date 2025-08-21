import {Card, ResourceItem, ResourceList} from '@shopify/polaris';

import React, {useState} from 'react';
import NotificationPopup from '@assets/components/NotificationPopup/NotificationPopup.js';

function ResourceListWithSortingAndMultiSelect() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');

  const items = [
    {
      id: '1',
      firstName : 'John Doe',
      city : 'New York',
      country : 'United States',
      productName : 'Puffer Jacket With Hidden Hood',
      timestamp : 'a day ago',
      productImage : 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e783e052-9360-4afb-adb8-c4e9c0f5db07/NIKE+AIR+MAX+NUAXIS.png'
    },
    {
      id: '1',
      firstName : 'John Doe',
      city : 'New York',
      country : 'United States',
      productName : 'Puffer Jacket With Hidden Hood',
      timestamp : 'a day ago',
      productImage : 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e783e052-9360-4afb-adb8-c4e9c0f5db07/NIKE+AIR+MAX+NUAXIS.png'
    },
    {
      id: '1',
      firstName : 'John Doe',
      city : 'New York',
      country : 'United States',
      productName : 'Puffer Jacket With Hidden Hood',
      timestamp : 'a day ago',
      productImage : 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e783e052-9360-4afb-adb8-c4e9c0f5db07/NIKE+AIR+MAX+NUAXIS.png'
    }
  ];

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
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

  function renderItem(item) {
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
        ></NotificationPopup>
      </ResourceItem>
    );
  }
}
export default ResourceListWithSortingAndMultiSelect;
