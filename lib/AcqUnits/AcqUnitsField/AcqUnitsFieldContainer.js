import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { get, uniq, compact } from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '../../constants';
import { baseManifest } from '../../manifests';
import { usePrevious } from '../../utils';

import AcqUnitsField from './AcqUnitsField';

export const buildAcqUnitsQuery = (units, isEdit) => {
  return compact([
    isEdit ? undefined : 'protectCreate==false',
    ...uniq(units).map(acquisitionsUnitId => `id==${acquisitionsUnitId}`),
  ]).join(' or ');
};

const AcqUnitsFieldContainer = ({
  name, resources, mutator, stripes, preselectedUnits, perm, isEdit,
}) => {
  const userId = get(stripes, 'user.user.id');
  const prevUserId = usePrevious(userId);

  useEffect(() => {
    if (userId !== prevUserId) {
      mutator.acqUnitMemberships.reset();
      mutator.acqUnitsEdit.reset();

      mutator.acqUnitMemberships.GET({
        params: {
          limit: LIMIT_MAX,
          query: `userId==${userId}`,
        },
      }).then(memberships => {
        const units = [
          ...memberships.map(({ acquisitionsUnitId }) => acquisitionsUnitId),
          ...preselectedUnits,
        ];
        const query = buildAcqUnitsQuery(units, isEdit);

        if (query.length) {
          mutator.acqUnitsEdit.GET({
            params: {
              limit: LIMIT_MAX,
              query,
            },
          });
        }
      });
    }
  });

  const units = get(resources, 'acqUnitsEdit.records', []);

  return (
    <AcqUnitsField
      name={name}
      units={units}
      disabled={perm ? !stripes.hasPerm(perm) : false}
    />
  );
};

AcqUnitsFieldContainer.manifest = Object.freeze({
  acqUnitMemberships: {
    ...baseManifest,
    path: 'acquisitions-units/memberships',
    records: 'acquisitionsUnitMemberships',
    accumulate: true,
  },
  acqUnitsEdit: {
    ...baseManifest,
    path: 'acquisitions-units/units',
    records: 'acquisitionsUnits',
    accumulate: true,
  },
});

AcqUnitsFieldContainer.propTypes = {
  stripes: stripesShape.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string,
  preselectedUnits: PropTypes.arrayOf(PropTypes.string),
  perm: PropTypes.string,
  isEdit: PropTypes.bool,
};

AcqUnitsFieldContainer.defaultProps = {
  name: 'acqUnitIds',
  preselectedUnits: [],
  perm: '',
  isEdit: false,
};

export default stripesConnect(AcqUnitsFieldContainer);
