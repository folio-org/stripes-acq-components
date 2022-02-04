import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { SelectionFilter } from '../SelectionFilter';
import { acqUnitsShape } from '../shapes';
import { getAcqUnitsOptions } from '../utils';
import { emptyArrayFilterValue } from '../constants';

const noAcqUnitOption = {
  value: emptyArrayFilterValue,
  label: <FormattedMessage id="stripes-acq-components.filter.acqUnit.noAcqUnit" />,
};

const AcqUnitFilter = ({ acqUnits, ...rest }) => {
  const acqUnitsOptions = useMemo(() => getAcqUnitsOptions(acqUnits), [acqUnits]);

  return (
    <SelectionFilter
      {...rest}
      options={[noAcqUnitOption, ...acqUnitsOptions]}
    />
  );
};

AcqUnitFilter.propTypes = {
  acqUnits: acqUnitsShape,
};

export default AcqUnitFilter;
