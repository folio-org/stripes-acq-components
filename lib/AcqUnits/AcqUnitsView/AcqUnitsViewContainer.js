import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '../../constants';
import { baseManifest } from '../../manifests';

import AcqUnitsView from './AcqUnitsView';

const AcqUnitsViewContainer = ({
  resources, mutator, units,
}) => {
  useEffect(() => {
    mutator.acqUnitsView.reset();

    if (units.length) {
      mutator.acqUnitsView.GET({
        params: {
          limit: LIMIT_MAX,
          query: units.map(unit => `id==${unit}`).join(' or '),
        },
      });
    }
  }, [mutator.acqUnitsView, units]);

  const unitLabels = get(resources, 'acqUnitsView.records', []).map(unit => unit.name);

  return (
    <AcqUnitsView units={unitLabels} />
  );
};

AcqUnitsViewContainer.manifest = Object.freeze({
  acqUnitsView: {
    ...baseManifest,
    path: 'acquisitions-units/units',
    records: 'acquisitionsUnits',
    accumulate: true,
  },
});

AcqUnitsViewContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  units: PropTypes.arrayOf(PropTypes.string),
};

AcqUnitsViewContainer.defaultProps = {
  units: [],
};

export default stripesConnect(AcqUnitsViewContainer);
