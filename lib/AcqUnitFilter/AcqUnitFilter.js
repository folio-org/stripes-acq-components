import React from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { selectOptionsShape } from '../shapes';

const AcqUnitFilter = ({ acqUnitsOptions, ...rest }) => (
  <SelectionFilter
    {...rest}
    options={acqUnitsOptions}
  />
);

AcqUnitFilter.propTypes = {
  acqUnitsOptions: selectOptionsShape,
};

export default AcqUnitFilter;
