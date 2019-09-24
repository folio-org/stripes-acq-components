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
      const joinedUnitIds = units.map(unit => `id==${unit}`).join(' or ');

      mutator.acqUnitsView.GET({
        params: {
          limit: LIMIT_MAX,
          query: `(${joinedUnitIds}) or (isDeleted==true and (${joinedUnitIds}))`,
        },
      });
    }
  }, [mutator.acqUnitsView, units]);

  const unitRecords = get(resources, 'acqUnitsView.records', []);

  return (
    <AcqUnitsView units={unitRecords} />
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
