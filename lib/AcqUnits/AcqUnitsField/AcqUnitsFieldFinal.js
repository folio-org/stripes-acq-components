import React from 'react';
import PropTypes from 'prop-types';

import AcqUnitsFieldContainer from './AcqUnitsFieldContainer';

const AcqUnitsFieldFinal = (props) => {
  return (
    <AcqUnitsFieldContainer
      isFinalForm
      {...props}
    />
  );
};

AcqUnitsFieldFinal.propTypes = {
  name: PropTypes.string,
  units: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  isFinal: PropTypes.bool.isRequired,
  id: PropTypes.string,
};

AcqUnitsFieldFinal.defaultProps = {
  name: 'acqUnitIds',
  units: [],
  disabled: false,
};

export default AcqUnitsFieldFinal;
