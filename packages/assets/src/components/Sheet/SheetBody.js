import React from 'react';
import PropTypes from 'prop-types';
import {Button, Scrollable} from '@shopify/polaris';

/**
 * @param handleClose
 * @param footer
 * @param loading
 * @param sectioned
 * @param darkBackground
 * @param classNames
 * @param onScrolledToBottom
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export default function SheetBody({
  handleClose,
  footer = true,
  loading = false,
  sectioned = true,
  darkBackground = false,
  classNames = [],
  onScrolledToBottom = () => {},
  children
}) {
  const allClasses = [
    'Avada-Sheet__Body',
    sectioned ? 'Avada-Sheet__BodySection' : '',
    darkBackground ? 'Avada-Sheet__BodyDarkBackground' : '',
    ...classNames
  ].filter(Boolean);

  return (
    <>
      <Scrollable className={allClasses.join(' ')} shadow onScrolledToBottom={onScrolledToBottom}>
        {children}
      </Scrollable>
      {footer && (
        <div className="Avada-Sheet__Footer">
          {handleClose && (
            <Button disabled={loading} onClick={() => !loading && handleClose()}>
              Close
            </Button>
          )}
        </div>
      )}
    </>
  );
}

SheetBody.propTypes = {
  handleClose: PropTypes.func,
  footer: PropTypes.bool,
  loading: PropTypes.bool,
  sectioned: PropTypes.bool,
  darkBackground: PropTypes.bool,
  classNames: PropTypes.array,
  onScrolledToBottom: PropTypes.func,
  children: PropTypes.node
};
