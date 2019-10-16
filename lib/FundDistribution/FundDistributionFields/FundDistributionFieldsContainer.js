import React from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { getFundsForSelect } from '../../utils';
import { baseManifest } from '../../manifests';
import FundDistributionFields from './FundDistributionFields';
import { DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';

const FundDistributionFieldsContainer = ({
  resources, fundDistribution, disabled, required, totalAmount, currency, name,
}) => {
  const funds = getFundsForSelect(resources);

  return (
    <FundDistributionFields
      currency={currency}
      disabled={disabled}
      fundDistribution={fundDistribution}
      funds={funds}
      name={name}
      required={required}
      totalAmount={totalAmount}
    />
  );
};

FundDistributionFieldsContainer.manifest = Object.freeze({
  [DICT_FUNDS]: {
    ...baseManifest,
    path: 'finance-storage/funds',
    params: {
      query: 'cql.allRecords=1 sortby name',
    },
    records: 'funds',
  },
});

FundDistributionFieldsContainer.propTypes = {
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  fundDistribution: fundDistributionShape,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  resources: PropTypes.object.isRequired,
  totalAmount: PropTypes.number,
};

FundDistributionFieldsContainer.defaultProps = {
  disabled: false,
  required: true,
  totalAmount: 0,
};

export default stripesConnect(FundDistributionFieldsContainer);
