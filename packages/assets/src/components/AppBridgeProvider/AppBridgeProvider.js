import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {NavMenu} from '@shopify/app-bridge-react';
import {Link} from 'react-router-dom';
import {MaxModalContext} from '@assets/contexts/maxModalContext';
import {navigationLinks} from '@assets/const/navigation';

export default function AppBridgeProvider({children}) {
  const {isFullscreen} = useContext(MaxModalContext);
  if (isFullscreen) return children; // hide navigation when open max modal

  return (
    <>
      <NavMenu>
        <Link to="/embed" rel="home">
          Home
        </Link>
        {navigationLinks.map(link => (
          <Link to={link.destination} key={link.destination}>
            {link.label}
          </Link>
        ))}
      </NavMenu>
      {children}
    </>
  );
}

AppBridgeProvider.propTypes = {
  children: PropTypes.any
};
