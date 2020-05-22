import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash';

import { FieldMultiSelection, FieldMultiSelectionFinal } from '../../FieldMultiSelection';

import acqUnitsCss from '../AcqUnits.css';

const itemToString = item => item;
const label = <FormattedMessage id="stripes-acq-components.label.acqUnits" />;

const AcqUnitsField = ({ name, units, disabled, isFinal, id: domId }) => {
  // eslint-disable-next-line react/prop-types
  const formatter = ({ option }) => {
    const item = find(units, { id: option }) || option;

    if (!item) return option;

    return <span className={item.isDeleted ? acqUnitsCss.deletedUnit : ''}>{item.name}</span>;
  };

  const getOptionsList = () => {
    return units.map(({ id }) => id);
  };

  const Component = isFinal ? FieldMultiSelectionFinal : FieldMultiSelection;

  return (
    <Component
      id={domId}
      name={name}
      label={label}
      dataOptions={getOptionsList()}
      itemToString={itemToString}
      formatter={formatter}
      disabled={disabled}
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
