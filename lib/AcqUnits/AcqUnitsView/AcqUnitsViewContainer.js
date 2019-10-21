import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '../../constants';
import { baseManifest } from '../../manifests';

import AcqUnitsView from './AcqUnitsView';

const AcqUnitsViewContainer = ({ mutator, units }) => {
  const [unitRecords, setUnitRecords] = useState([]);

  useEffect(() => {
    mutator.acqUnitsView.reset();

    if (units.length) {
      const joinedUnitIds = units.map(unit => `id==${unit}`).join(' or ');

      mutator.acqUnitsView.GET({
        params: {
          limit: LIMIT_MAX,
          query: `((isDeleted==false or isDeleted==true) and (${joinedUnitIds}))`,
        },
      }).then(setUnitRecords);
    } else {
      setUnitRecords([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

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
  mutator: PropTypes.object.isRequired,
  units: PropTypes.arrayOf(PropTypes.string),
};

AcqUnitsViewContainer.defaultProps = {
  units: [],
};

export default stripesConnect(AcqUnitsViewContainer);
