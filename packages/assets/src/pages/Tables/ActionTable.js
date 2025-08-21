import React from 'react';
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  EmptyState,
  Layout,
  Text,
  TextField
} from '@shopify/polaris';
import useAdvancedIndexTable from '@assets/hooks/table/useAdvancedIndexTable';
import {DeleteIcon, EditIcon} from '@shopify/polaris-icons';
import formatDateTime from '@functions/helpers/datetime/formatDateTime';
import useEditApi from '@assets/hooks/api/useEditApi';
import useConfirmModal from '@assets/hooks/popup/useConfirmModal';
import useCreateApi from '@assets/hooks/api/useCreateApi';
import useDeleteApi from '@assets/hooks/api/useDeleteApi';
import useInput from '@assets/hooks/form/useInput';

/**
 * @return {JSX.Element}
 */
export default function ActionTable() {
  const handleAddTopic = (topic = {}) => {
    setInputTopic(topic);
    openAddModal();
  };
  const handleEditTopic = topic => {
    setInputTopic(topic);
    openEditModal();
  };

  const [inputTopic, handleChangeInputTopic, setInputTopic] = useInput({});

  const inputForm = () => (
    <BlockStack gap="200">
      <TextField
        label="Plan"
        value={inputTopic.plan}
        onChange={val => handleChangeInputTopic('plan', val)}
        autoComplete="off"
      />
      <TextField
        type="datetime-local"
        label="Start at"
        autoComplete="off"
        value={inputTopic.startsAt}
        onChange={val => handleChangeInputTopic('startsAt', val)}
      />
      <TextField
        type="datetime-local"
        label="End at"
        value={inputTopic.endsAt}
        onChange={val => handleChangeInputTopic('endsAt', val)}
        autoComplete="off"
      />
    </BlockStack>
  );

  const {creating, handleCreate} = useCreateApi({
    url: '/subscriptions',
    successCallback: () => refetchData()
  });

  const {editing, handleEdit} = useEditApi({
    url: '/subscriptions',
    successCallback: () => refetchData()
  });

  const {deleting, handleDelete} = useDeleteApi({
    url: '/subscriptions',
    successCallback: () => refetchData()
  });

  const {modal: addModal, openModal: openAddModal} = useConfirmModal({
    title: 'Add subscription',
    content: inputForm(),
    loading: creating,
    confirmAction: () => handleCreate(inputTopic)
  });

  const {modal: editModal, openModal: openEditModal} = useConfirmModal({
    title: 'Edit subscription',
    content: inputForm(),
    loading: editing,
    confirmAction: () => handleEdit(inputTopic)
  });

  const {modal: deleteModal, openModal: openDeleteModal} = useConfirmModal({
    title: 'Delete subscription',
    content: '',
    destructive: true,
    loading: deleting,
    // eslint-disable-next-line react/display-name,react/prop-types
    ComponentContent: ({currentId: data}) => (
      <>
        {'This will delete subscription '}
        <Text as="span" fontWeight="semibold">
          {data.current.plan}
        </Text>
      </>
    ),
    confirmAction: ({id}) => handleDelete({id})
  });

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
      <div key={index}>{formatDateTime(createdAt)}</div>,
      <ButtonGroup key={index}>
        <div
          onClick={e => {
            e.stopPropagation();
            handleEditTopic(item);
          }}
        >
          <Button variant="plain" icon={EditIcon} />
        </div>
        <div
          onClick={e => {
            e.stopPropagation();
            openDeleteModal(item);
          }}
        >
          <Button variant="plain" icon={DeleteIcon} />
        </div>
      </ButtonGroup>
    ];
  };

  const {dataTable, refetchData} = useAdvancedIndexTable({
    resourceData: {singular: 'subscription', plural: 'subscriptions'},
    fetchUrl: '/subscriptions',
    columns: ['Plan', 'Start at', 'End at', 'Created at', 'Actions'].map(title => ({title})),
    initQueries: {sort: 'createdAt_desc', limit: '20', hasCount: true},
    customKeys: {hasCount: true},
    defaultOrder: 'createdAt_desc',
    defaultLimit: '20',
    renderItemCols: itemCols,
    onClickRow: handleEditTopic,
    searchable: true,
    searchPlaceholder: 'Search by plan',
    emptyState: (
      <EmptyState
        heading="Add your subscription"
        action={{onAction: () => handleAddTopic(), content: 'Add subscription'}}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        {`Add subscriptions for testing purposes`}
      </EmptyState>
    )
  });

  return (
    <Layout sectioned>
      <BlockStack gap="400">
        <div>
          <Button onClick={() => handleAddTopic()}>Add subscription</Button>
        </div>
        <Card padding="0">{dataTable}</Card>
      </BlockStack>
      {addModal}
      {editModal}
      {deleteModal}
    </Layout>
  );
}
