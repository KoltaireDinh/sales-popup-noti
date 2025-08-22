import {TextField} from '@shopify/polaris';
import {useCallback, useState} from 'react';

function HelpTextField() {
  const [textFieldValue, setTextFieldValue] = useState();

  const handleTextFieldChange = useCallback(value => setTextFieldValue(value), []);

  return (
    <TextField

      size="large"
      multiline={true}
      label="Excluded pages"
      type="text"
      value={textFieldValue}
      onChange={handleTextFieldChange}
      helpText="Pages URLs NOT to show the pop-up (separated by new lines)"
      autoComplete="email"
    ></TextField>
  );
}

export default HelpTextField;
