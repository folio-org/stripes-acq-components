import identity from 'lodash/identity';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectionFinal } from '../FieldSelection';
import { FindLocation } from '../FindLocation';
import { fieldSelectOptionsShape } from '../shapes';
import { validateRequired } from '../utils';

const FieldLocationFinal = ({
  fieldComponent,
  filterLocations,
  isDisabled,
  labelId,
  locationLookupLabel,
  locationsForSelect,
  name,
  required,
  selectLocationFromPlugin,
}) => {
  const FieldComponent = fieldComponent || FieldSelectionFinal;

  return (
    <div>
      <FieldComponent
        dataOptions={locationsForSelect}
        isNonInteractive={isDisabled}
        fullWidth
        id={`field-${name}`}
        label={labelId ? <FormattedMessage id={labelId} /> : ''}
        marginBottom0
        name={name}
        required={required}
        validate={required ? validateRequired : undefined}
      />
      {!isDisabled && (
        <FindLocation
          filterRecords={filterLocations}
          searchButtonStyle="link"
          searchLabel={locationLookupLabel}
          onRecordsSelect={selectLocationFromPlugin}
        />
      )}
    </div>
  );
};

FieldLocationFinal.propTypes = {
  fieldComponent: PropTypes.elementType,
  filterLocations: PropTypes.func,
  isDisabled: PropTypes.bool.isRequired,
  labelId: PropTypes.string,
  locationLookupLabel: PropTypes.node,
  locationsForSelect: fieldSelectOptionsShape.isRequired,
  name: PropTypes.string,
  required: PropTypes.bool.isRequired,
  selectLocationFromPlugin: PropTypes.func.isRequired,
};

FieldLocationFinal.defaultProps = {
  filterLocations: identity,
  locationLookupLabel: <FormattedMessage id="stripes-smart-components.ll.locationLookup" />,
};

export default FieldLocationFinal;
