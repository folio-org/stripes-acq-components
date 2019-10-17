import React from 'react';
import { Field } from 'redux-form';

import { MultiSelection } from '@folio/stripes/components';

const onBlurDefault = e => { e.preventDefault(); };

const FieldMultiSelection = (props) => {
  return (
    <Field
      component={MultiSelection}
      onBlur={onBlurDefault}
      {...props}
    />
  );
};

export default FieldMultiSelection;
