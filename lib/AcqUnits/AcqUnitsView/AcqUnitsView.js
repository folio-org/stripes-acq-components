import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import acqUnitsCss from '../AcqUnits.css';

const label = <FormattedMessage id="stripes-acq-components.label.acqUnits" />;

const DEFAULT_ACQUISITION_UNITS = [];

const AcqUnitsView = ({ units = DEFAULT_ACQUISITION_UNITS }) => {
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

export default AcqUnitsView;
