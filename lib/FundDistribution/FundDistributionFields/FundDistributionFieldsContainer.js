import React from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { getFundsForSelect } from '../../utils';
import { baseManifest } from '../../manifests';
import FundDistributionFields from './FundDistributionFields';
import { DICT_FUNDS } from '../../constants';

const FundDistributionFieldsContainer = ({
  resources, formValues, disabled, required, totalAmount, currency, name,
}) => {
  const funds = getFundsForSelect(resources);

  return (
    <FundDistributionFields
      formValues={formValues}
      name={name}
      funds={funds}
      totalAmount={totalAmount}
      required={required}
      disabled={disabled}
      currency={currency}
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
  resources: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  totalAmount: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  currency: PropTypes.string,
  name: PropTypes.string,
};

FundDistributionFieldsContainer.defaultProps = {
  disabled: false,
  required: true,
  name: 'fundDistributions',
};

export default stripesConnect(FundDistributionFieldsContainer);
