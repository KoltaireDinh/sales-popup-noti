import {Select} from '@shopify/polaris';

import {useState, useCallback, useEffect} from 'react';


function SelectExample({ value, onChange }) {
  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'},
  ];

  return (
    <Select
      label="Pages restriction"
      options={options}
      value={value}
      onChange={newValue => onChange(newValue)}
    />
  );
}

export default SelectExample;
