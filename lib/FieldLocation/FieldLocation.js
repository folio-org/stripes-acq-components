import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { LocationLookup } from '@folio/stripes/smart-components';

import {
  FieldSelection,
  FieldSelectionFinal,
} from '../FieldSelection';
import { validateRequired } from '../utils';
import { fieldSelectOptionsShape } from '../shapes';

const FieldLocation = ({
  isDisabled,
  isReduxField,
  labelId,
  locationLookupLabel,
  locationsForSelect,
  name,
  required,
  selectLocationFromPlugin,
  validate,
}) => {
  const Component = isReduxField ? FieldSelection : FieldSelectionFinal;
  const validateValue = validate || (required && validateRequired);

  return (
    <div>
      <Component
        dataOptions={locationsForSelect}
        disabled={isDisabled}
        fullWidth
        id={`field-${name}`}
        label={labelId ? <FormattedMessage id={labelId} /> : ''}
        marginBottom0
        name={name}
        required={required}
        validate={validateValue}
      />
      {!isDisabled && (
        <LocationLookup
          label={locationLookupLabel}
          onLocationSelected={selectLocationFromPlugin}
        />
      )}
    </div>
  );
};

FieldLocation.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isReduxField: PropTypes.bool,
  labelId: PropTypes.string,
  locationLookupLabel: PropTypes.node,
  locationsForSelect: fieldSelectOptionsShape.isRequired,
  name: PropTypes.string,
  required: PropTypes.bool.isRequired,
  selectLocationFromPlugin: PropTypes.func.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
};

export default FieldLocation;
