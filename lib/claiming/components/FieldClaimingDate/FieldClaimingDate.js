import PropTypes from 'prop-types';

import { FieldDatepickerFinal } from '../../../FieldDatepicker';
import { validateRequired } from '../../../utils';
import {
  excludePreviousDays,
  validateClaimingDate,
} from './utils';

export const FieldClaimingDate = ({
  name = 'claimingDate',
  required = true,
  ...props
}) => {
  const validate = (value) => {
    return (
      (required && validateRequired(value))
      || validateClaimingDate(value)
    );
  };

  return (
    <FieldDatepickerFinal
      usePortal
      name={name}
      required={required}
      validate={validate}
      exclude={excludePreviousDays}
      {...props}
    />
  );
};

FieldClaimingDate.propTypes = {
  name: PropTypes.string,
  required: PropTypes.bool,
};
