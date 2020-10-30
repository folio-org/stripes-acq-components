import React from 'react';
import { Field } from 'react-final-form';

import FieldAutosuggest from './FieldAutoSuggest';

const FieldAutoSuggestFinal = (props) => {
  return (
    <FieldAutosuggest
      fieldComponent={Field}
      renderValue={value => value || ''}
      withFinalForm
      {...props}
    />
  );
};

export default FieldAutoSuggestFinal;
