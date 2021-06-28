import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash';

import { OptionSegment } from '@folio/stripes/components';

import { FieldMultiSelection, FieldMultiSelectionFinal } from '../../FieldMultiSelection';

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

const AcqUnitsField = ({ name, units, disabled, isFinal, id: domId }) => {
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
  name: PropTypes.string,
  units: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  isFinal: PropTypes.bool.isRequired,
  id: PropTypes.string,
};

AcqUnitsField.defaultProps = {
  name: 'acqUnitIds',
  units: [],
  disabled: false,
};

export default AcqUnitsField;
