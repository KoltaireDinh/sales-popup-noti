import React from 'react';
import {BlockStack, Card, Layout} from '@shopify/polaris';
import formatDateTime from '@functions/helpers/datetime/formatDateTime';
import useAdvancedIndexTable from '@assets/hooks/table/useAdvancedIndexTable';

/**
 * @return {JSX.Element}
 */
export default function SimpleTable() {
  /**
   * @param {*} item
   * @param index
   * @returns {React.JSX.Element[]}
   */
  const itemCols = (item, index) => {
    const {plan, startsAt, endsAt, createdAt} = item;
    return [
      <div key={index}>{plan}</div>,
      <div key={index}>{formatDateTime(startsAt)}</div>,
      <div key={index}>{formatDateTime(endsAt)}</div>,
      <div key={index}>{formatDateTime(createdAt)}</div>
    ];
  };

  const {dataTable} = useAdvancedIndexTable({
    resourceData: {singular: 'subscription', plural: 'subscriptions'},
    fetchUrl: '/subscriptions',
    columns: ['Plan', 'Start at', 'End at', 'Created at'].map(title => ({title})),
    initQueries: {sort: 'createdAt_desc', limit: '20', hasCount: true},
    customKeys: {hasCount: true},
    defaultOrder: 'createdAt_desc',
    defaultLimit: '20',
    renderItemCols: itemCols
  });

  return (
    <Layout sectioned>
      <BlockStack gap="400">
        <Card padding="0">{dataTable}</Card>
      </BlockStack>
    </Layout>
  );
}
