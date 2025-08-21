import React from 'react';
import {Button, Text} from '@shopify/polaris';
import * as PropTypes from 'prop-types';
import {XIcon} from '@shopify/polaris-icons';

/**
 * @param handleClose
 * @param title
 * @param loading
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export default function SheetHeader({handleClose, title = '', loading = false, children}) {
  return (
    <div className="Avada-Sheet__Header">
      {title && (
        <Text variant="headingLg" as="p">
          {title}
        </Text>
      )}
      {children}
      <Button icon={XIcon} disabled={loading} onClick={() => handleClose()} variant="plain" />
    </div>
  );
}

SheetHeader.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
  loading: PropTypes.bool,
  children: PropTypes.node
};
