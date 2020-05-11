import React, { useMemo } from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { acqUnitsShape } from '../shapes';
import { getAcqUnitsOptions } from '../utils';

const AcqUnitFilter = ({ acqUnits, ...rest }) => {
  const acqUnitsOptions = useMemo(() => getAcqUnitsOptions(acqUnits), [acqUnits]);

  return (
    <SelectionFilter
      {...rest}
      options={acqUnitsOptions}
    />
  );
};

AcqUnitFilter.propTypes = {
  acqUnits: acqUnitsShape,
};

export default AcqUnitFilter;
