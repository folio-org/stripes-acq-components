import React from 'react';
import { Field } from 'react-final-form';

import FieldSelect from './FieldSelect';

const FieldSelectFinal = (props) => {
  return (
    <FieldSelect
      fieldComponent={Field}
      {...props}
    />
  );
};

export default FieldSelectFinal;
