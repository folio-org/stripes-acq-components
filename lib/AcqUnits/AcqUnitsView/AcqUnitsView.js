import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
} from '@folio/stripes/components';

import acqUnitsCss from '../AcqUnits.css';

const label = <FormattedMessage id="stripes-acq-components.label.acqUnits" />;

const AcqUnitsView = ({ units }) => {
  return (
    <KeyValue label={label}>
      {
        units.map((unit, idx) => (
          <Fragment>
            <span className={unit.isDeleted ? acqUnitsCss.deletedUnit : ''}>{unit.name}</span>
            {idx !== units.length - 1 ? ', ' : ''}
          </Fragment>
        ))
      }
    </KeyValue>
  );
};

AcqUnitsView.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object),
};

AcqUnitsView.defaultProps = {
  units: [],
};

export default AcqUnitsView;
