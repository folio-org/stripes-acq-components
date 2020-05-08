import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { SelectionFilter } from '../SelectionFilter';
import { getAcqUnitsOptions } from '../utils';
import { acqUnitsResource } from '../manifests';

const AcqUnitFilter = ({ resources, ...rest }) => {
  const options = useMemo(() => getAcqUnitsOptions(resources), [resources]);

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

AcqUnitFilter.manifest = Object.freeze({
  acqUnits: acqUnitsResource,
});

AcqUnitFilter.propTypes = {
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(AcqUnitFilter);
