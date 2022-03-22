import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { SelectionFilter } from '../SelectionFilter';
import { acqUnitsShape } from '../shapes';
import { getAcqUnitsOptions } from '../utils';
import { emptyArrayFilterValue } from '../constants';

const AcqUnitFilter = ({ acqUnits, ...rest }) => {
  const intl = useIntl();
  const noAcqUnitOption = {
    value: emptyArrayFilterValue,
    label: intl.formatMessage({ id: 'stripes-acq-components.filter.acqUnit.noAcqUnit' }),
  };
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
