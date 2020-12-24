import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import FieldSelect from './FieldSelect';

const FieldSelectFinal = (props) => {
  return (
    <FieldSelect
      fieldComponent={Field}
      {...props}
      key={`${props.key}-${props.required ? 1 : 0}`} // https://final-form.org/docs/react-final-form/types/FieldProps#validate
    />
  );
};

FieldSelectFinal.propTypes = {
  key: PropTypes.string,
  required: PropTypes.bool,
};

export default FieldSelectFinal;
