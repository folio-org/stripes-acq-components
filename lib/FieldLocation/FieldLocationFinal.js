import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { LocationLookup } from '@folio/stripes/smart-components';

import { FieldSelectFinal } from '../FieldSelect';

import { validateRequired } from '../utils';
import { fieldSelectOptionsShape } from '../shapes';

const FieldLocationFinal = ({
  isDisabled,
  labelId,
  locationLookupLabel,
  locationsForSelect,
  name,
  required,
  selectLocation,
}) => (
  <div>
    <FieldSelectFinal
      dataOptions={locationsForSelect}
      fullWidth
      id={`field-${name}`}
      label={labelId ? <FormattedMessage id={labelId} /> : ''}
      marginBottom0
      name={name}
      required={required}
      validate={required ? validateRequired : undefined}
    />
    <LocationLookup
      label={locationLookupLabel}
      onLocationSelected={selectLocation}
    />
  </div>
);

FieldLocationFinal.propTypes = {
  labelId: PropTypes.string,
  locationLookupLabel: PropTypes.node,
  locationsForSelect: fieldSelectOptionsShape.isRequired,
  name: PropTypes.string,
  required: PropTypes.bool.isRequired,
  selectLocation: PropTypes.func.isRequired,
};

export default FieldLocationFinal;
