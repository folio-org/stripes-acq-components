import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, uniq, find } from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import { FieldMultiSelection } from '../FieldMultiSelection';
import { LIMIT_MAX } from '../constants';
import { baseManifest } from '../manifests';
import { usePrevious } from '../utils';

const itemToString = item => item;
const label = <FormattedMessage id="stripes-acq-components.label.acqUnits" />;

const AcqUnits = ({ name, resources, mutator, stripes }) => {
  const userId = get(stripes, 'user.user.id');
  const prevUserId = usePrevious(userId);

  useEffect(() => {
    if (userId !== prevUserId) {
      mutator.acqUnitMemberships.reset();
      mutator.acqUnits.reset();

      mutator.acqUnitMemberships.GET({
        params: {
          limit: LIMIT_MAX,
          query: `userId==${userId}`,
        },
      }).then(memberships => {
        const unitIds = uniq(memberships.map(({ acquisitionsUnitId }) => `id==${acquisitionsUnitId}`)).join('or');

        if (unitIds.length) {
          mutator.acqUnits.GET({
            params: {
              limit: LIMIT_MAX,
              query: unitIds,
            },
          });
        }
      });
    }
  });

  const formatter = ({ option }) => {
    const units = get(resources, 'acqUnits.records', []);
    const item = find(units, { id: option }) || option;

    if (!item) return option;

    return item.name;
  };

  const getOptionsList = () => {
    return get(resources, 'acqUnits.records', []).map(({ id }) => id);
  };

  return (
    <FieldMultiSelection
      name={name}
      label={label}
      dataOptions={getOptionsList()}
      itemToString={itemToString}
      formatter={formatter}
    />
  );
};

AcqUnits.manifest = Object.freeze({
  acqUnitMemberships: {
    ...baseManifest,
    path: 'acquisitions-units/memberships',
    records: 'acquisitionsUnitMemberships',
    accumulate: true,
  },
  acqUnits: {
    ...baseManifest,
    path: 'acquisitions-units/units',
    records: 'acquisitionsUnits',
    accumulate: true,
  },
});

AcqUnits.propTypes = {
  stripes: stripesShape.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string,
};

AcqUnits.defaultProps = {
  name: 'acqUnitIds',
};

export default stripesConnect(AcqUnits);
