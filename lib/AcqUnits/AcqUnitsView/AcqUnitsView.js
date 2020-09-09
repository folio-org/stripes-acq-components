import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import acqUnitsCss from '../AcqUnits.css';

const label = <FormattedMessage id="stripes-acq-components.label.acqUnits" />;

const AcqUnitsView = ({ units }) => {
  const acqUnitsValue = units?.length
    ? units.map((unit, idx) => (
      <Fragment key={unit.id}>
        <span className={unit.isDeleted ? acqUnitsCss.deletedUnit : ''}>{unit.name}</span>
        {idx !== units.length - 1 ? ', ' : ''}
      </Fragment>
    ))
    : <NoValue />;

  return (
    <KeyValue
      data-testid="acqUnits"
      label={label}
      value={acqUnitsValue}
    />
  );
};

AcqUnitsView.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object),
};

AcqUnitsView.defaultProps = {
  units: [],
};

export default AcqUnitsView;
