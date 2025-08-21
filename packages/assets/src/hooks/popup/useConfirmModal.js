import React, {useCallback, useRef, useState} from 'react';
import {Form, Modal} from '@shopify/polaris';

/**
 *
 * @param confirmAction
 * @param cancelAction
 * @param title
 * @param {string | Element } content
 * @param ComponentContent
 * @param buttonTitle
 * @param closeTitle
 * @param footer
 * @param loading
 * @param disabled
 * @param destructive
 * @param setValidations
 * @param closeCallback
 * @param canCloseAfterFinished
 * @param useForm
 * @returns {{openModal: openModal, closeModal: closeModal, modal: React.JSX.Element, open: boolean}}
 */
export default function useConfirmModal({
  confirmAction,
  cancelAction,
  title = 'Are you sure to delete?',
  content = 'Please be careful because you cannot undo this action.',
  ComponentContent = _p => <></>,
  buttonTitle = 'Confirm',
  closeTitle = 'Cancel',
  footer = null,
  loading = false,
  disabled = false,
  destructive = false,
  setValidations = () => {},
  closeCallback = () => {},
  canCloseAfterFinished = true,
  useForm = false
}) {
  const [open, setOpen] = useState(false);
  const currentId = useRef(null);

  const openModal = useCallback((id = null) => {
    setOpen(true);
    if (id !== null) currentId.current = id;
  }, []);

  const closeModal = () => {
    if (loading) return;
    setOpen(false);
    setValidations({});
  };

  const handleConfirm = async () => {
    const success = await confirmAction(currentId.current);
    if (!success) return;
    canCloseAfterFinished && closeModal();
  };

  const modal = (
    <Modal
      sectioned
      open={open}
      onClose={() => {
        closeModal();
        closeCallback();
      }}
      title={title}
      primaryAction={
        buttonTitle && {
          content: buttonTitle,
          loading,
          disabled,
          destructive,
          onAction: () => handleConfirm()
        }
      }
      secondaryActions={[
        closeTitle && {
          content: closeTitle,
          onAction: () => {
            if (cancelAction) {
              cancelAction();
              return;
            }
            closeModal();
            closeCallback();
          }
        }
      ].filter(Boolean)}
      footer={footer}
    >
      {content ||
        (useForm ? (
          <Form onSubmit={() => handleConfirm()} preventDefault>
            <ComponentContent {...{closeModal, currentId}} />
          </Form>
        ) : (
          <ComponentContent {...{closeModal, currentId}} />
        ))}
    </Modal>
  );

  return {modal, open, closeModal, openModal};
}
