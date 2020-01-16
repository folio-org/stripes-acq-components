import React from 'react';
import { Field } from 'react-final-form';

import FieldDatepicker from './FieldDatepicker';

const FieldDatepickerFinal = (props) => {
  return (
    <FieldDatepicker
      fieldComponent={Field}
      {...props}
    />
  );
};

export default FieldDatepickerFinal;
