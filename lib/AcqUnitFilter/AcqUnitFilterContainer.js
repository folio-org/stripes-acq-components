import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { acqUnitsManifest } from '../manifests';
import AcqUnitFilter from './AcqUnitFilter';

const AcqUnitFilterContainer = ({ resources, ...rest }) => {
  const acqUnitsRecords = resources.acqUnits?.records;

  return (
    <AcqUnitFilter
      labelId="stripes-acq-components.filter.acqUnit"
      {...rest}
      acqUnits={acqUnitsRecords}
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
