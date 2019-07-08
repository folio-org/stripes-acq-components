import React from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { getAcqUnitsOptions } from '../utils';
import { acqUnitsShape } from '../shapes';

const AcqUnitFilter = ({ acqUnits, ...rest }) => {
  const options = getAcqUnitsOptions(acqUnits);

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

AcqUnitFilter.propTypes = {
  acqUnits: acqUnitsShape,
};

export default AcqUnitFilter;
