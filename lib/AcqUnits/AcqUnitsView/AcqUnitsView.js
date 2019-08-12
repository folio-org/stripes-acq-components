import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
} from '@folio/stripes/components';

const label = <FormattedMessage id="stripes-acq-components.label.acqUnits" />;

const AcqUnitsView = ({ units }) => {
  return (
    <KeyValue
      label={label}
      value={units.join(', ')}
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
