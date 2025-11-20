import find from 'lodash/find';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { OptionSegment } from '@folio/stripes/components';

import {
  FieldMultiSelection,
  FieldMultiSelectionFinal,
} from '../../FieldMultiSelection';

import acqUnitsCss from '../AcqUnits.css';

const itemToString = item => item;
const label = <FormattedMessage id="stripes-acq-components.label.acqUnits" />;

export const filter = (units, value, dataOptions) => {
  const regex = new RegExp(value, 'i');

  const renderedItems = value
    ? units.filter(item => item.name.search(regex) !== -1).map(({ id }) => id)
    : dataOptions;

  return { renderedItems };
};

const DEFAULT_ACQUISITION_UNITS = [];

const AcqUnitsField = ({
  disabled = false,
  id: domId,
  isFinal,
  name = 'acqUnitIds',
  units = DEFAULT_ACQUISITION_UNITS,
}) => {
  // eslint-disable-next-line react/prop-types
  const formatter = ({ option, searchTerm }) => {
    const item = find(units, { id: option });

    if (!item) return option;

    return item.isDeleted
      ? <span className={item.isDeleted ? acqUnitsCss.deletedUnit : ''}>{item.name}</span>
      : <OptionSegment searchTerm={searchTerm}>{item.name}</OptionSegment>;
  };

  const getOptionsList = () => {
    return units.map(({ id }) => id);
  };

  const filterUnits = (value, dataOptions) => filter(units, value, dataOptions);

  const Component = isFinal ? FieldMultiSelectionFinal : FieldMultiSelection;

  return (
    <Component
      key={units.length}
      ariaLabelledBy={`${domId}-label`}
      id={domId}
      name={name}
      label={label}
      dataOptions={getOptionsList()}
      itemToString={itemToString}
      formatter={formatter}
      disabled={disabled}
      filter={filterUnits}
    />
  );
};

AcqUnitsField.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  isFinal: PropTypes.bool.isRequired,
  name: PropTypes.string,
  units: PropTypes.arrayOf(PropTypes.object),
};

export default AcqUnitsField;
