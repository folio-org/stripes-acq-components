import { Field } from 'react-final-form';

import { MultiSelection } from '@folio/stripes/components';

const onBlurDefault = e => { e.preventDefault(); };

const FieldMultiSelectionFinal = (props) => {
  return (
    <Field
      component={MultiSelection}
      onBlur={onBlurDefault}
      {...props}
    />
  );
};

export default FieldMultiSelectionFinal;
