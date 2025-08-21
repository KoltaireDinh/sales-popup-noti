import React from 'react';
import {Modal, TitleBar} from '@shopify/app-bridge-react';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const FullscreenModal = ({
  title = 'max modal 1',
  actions = [],
  modalSrc,
  openMaxModal,
  setOpenMaxModal,
  fullscreenBackUrl
}) => {
  const history = useHistory();

  if (!modalSrc) return null;

  return (
    <Modal
      onHide={() => {
        setOpenMaxModal(false);
        history.push(fullscreenBackUrl);
      }}
      open={openMaxModal}
      id="max-modal-src"
      variant="max"
      src={modalSrc}
    >
      <TitleBar title={title}>
        {actions.map((action, index) => (
          // eslint-disable-next-line react/no-unknown-property
          <button key={index} variant={action.primary} onClick={() => action.onClick()}>
            {action.title}
          </button>
        ))}
      </TitleBar>
    </Modal>
  );
};

export default FullscreenModal;

FullscreenModal.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.array,
  modalSrc: PropTypes.string,
  openMaxModal: PropTypes.bool,
  setOpenMaxModal: PropTypes.func,
  fullscreenBackUrl: PropTypes.string
};
