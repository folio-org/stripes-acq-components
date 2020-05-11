import React, { useMemo } from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { acqUnitsShape } from '../shapes';
import { getAcqUnitsOptions } from '../utils';

const AcqUnitFilter = ({ acqUnitsRecords, ...rest }) => {
  const acqUnitsOptions = useMemo(() => getAcqUnitsOptions(acqUnitsRecords), [acqUnitsRecords]);

  return (
    <SelectionFilter
      {...rest}
      options={acqUnitsOptions}
    />
  );
};

AcqUnitFilter.propTypes = {
  acqUnitsRecords: acqUnitsShape,
};

export default AcqUnitFilter;
