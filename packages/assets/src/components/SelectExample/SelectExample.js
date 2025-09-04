import {Select} from '@shopify/polaris';


function SelectExample({ value, onChange }) {
  const options = [
    {label: 'All pages', value: 'all'},
    {label: 'Specific pages', value: 'specific'},
  ];

  return (
    <Select
      options={options}
      value={value}
      onChange={newValue => onChange(newValue)}
    />
  );
}

export default SelectExample;
