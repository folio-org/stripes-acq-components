import React from 'react';
import { Field } from 'react-final-form';

import FieldAutosuggest from './FieldAutoSuggest';

const FieldAutoSuggestFinal = (props) => {
  return (
    <FieldAutosuggest
      fieldComponent={Field}
      withFinalForm
      {...props}
    />
  );
};

export default FieldAutoSuggestFinal;
