import React, {createContext, useState} from 'react';
import PropTypes from 'prop-types';
import {getUrl} from '@assets/helpers/getUrl';
import isEmbeddedAppEnv from '@assets/helpers/isEmbeddedAppEnv';
import FullscreenModal from '@assets/components/Molecules/FullscreenModal';
import {useHistory} from 'react-router-dom';

/** @type {{isFullscreen: boolean, openFullscreen, setOpenMaxModal, setActions, setFullscreenBackUrl}} */
const props = {};
export const MaxModalContext = createContext(props);

export const MaxModalProvider = ({children}) => {
  const history = useHistory();
  const [modalSrc, setModalSrc] = useState('');
  const [openMaxModal, setOpenMaxModal] = useState(false);
  const [actions, setActions] = useState([]);
  const [fullscreenBackUrl, setFullscreenBackUrl] = useState('/');

  const isFullscreen = isEmbeddedAppEnv ? window.parent.length > 1 : openMaxModal;

  const openFullscreen = rawUrl => {
    setOpenMaxModal(true);
    const url = getUrl(rawUrl);
    if (isEmbeddedAppEnv) {
      setModalSrc(url);
    } else {
      history.push(url);
    }
  };

  return (
    <MaxModalContext.Provider
      value={{isFullscreen, openFullscreen, setOpenMaxModal, setActions, setFullscreenBackUrl}}
    >
      {isEmbeddedAppEnv && (
        <FullscreenModal
          {...{actions, modalSrc, openMaxModal, setOpenMaxModal, fullscreenBackUrl}}
        />
      )}
      {children}
    </MaxModalContext.Provider>
  );
};

MaxModalProvider.propTypes = {
  children: PropTypes.any
};
