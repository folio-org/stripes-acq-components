import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import FieldSelect from './FieldSelect';

const FieldSelectFinal = (props) => {
  return (
    <FieldSelect
      fieldComponent={Field}
      key={props.required ? 1 : 0} // https://final-form.org/docs/react-final-form/types/FieldProps#validate
      {...props}
    />
  );
};

FieldSelectFinal.propTypes = {
  required: PropTypes.bool,
};

export default FieldSelectFinal;
