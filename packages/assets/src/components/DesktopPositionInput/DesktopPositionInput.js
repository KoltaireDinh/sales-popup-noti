import React from 'react';
import PropTypes from 'prop-types';
import './DesktopPositionInput.scss';
import {BlockStack, InlineStack, Labelled, Text} from '@shopify/polaris';

const defaultOptions = [
  {label: 'Bottom left', value: 'bottom-left'},
  {label: 'Bottom right', value: 'bottom-right'},
  {label: 'Top left', value: 'top-left'},
  {label: 'Top right', value: 'top-right'}
];

const DesktopPositionInput = ({label, value, onChange, helpText, options = defaultOptions}) => {
  return (
    <Labelled label={label}>
      <InlineStack gap={"500"}>
        {options.map((option, key) => (
          <div
            key={key}
            className={`Avada-DesktopPosition ${
              value === option.value ? 'Avada-DesktopPosition--selected' : ''
            }`}
            onClick={() => onChange(option.value)}
          >
            <div
              className={`Avada-DesktopPosition__Input Avada-DesktopPosition__Input--${option.value}`}
            ></div>
          </div>
        ))}
      </InlineStack>
      <Text variant="bodyLg" as="p" tone={'subdued'}>
        {helpText}
      </Text>
    </Labelled>
  );
};

DesktopPositionInput.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  helpText: PropTypes.string
};

export default DesktopPositionInput;
