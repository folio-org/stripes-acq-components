import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { getAcqUnitsOptions } from '../utils';
import { acqUnitsManifest } from '../manifests';
import AcqUnitFilter from './AcqUnitFilter';

const AcqUnitFilterContainer = ({ resources, ...rest }) => {
  const acqUnitsOptions = useMemo(() => getAcqUnitsOptions(resources.acqUnits), [resources.acqUnits]);

  return (
    <AcqUnitFilter
      {...rest}
      acqUnitsOptions={acqUnitsOptions}
    />
  );
};

AcqUnitFilterContainer.manifest = Object.freeze({
  acqUnits: acqUnitsManifest,
});

AcqUnitFilterContainer.propTypes = {
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(AcqUnitFilterContainer);
