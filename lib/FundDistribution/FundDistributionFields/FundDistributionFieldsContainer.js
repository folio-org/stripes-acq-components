import React from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { getFundsForSelect } from '../../utils';
import { baseManifest } from '../../manifests';
import FundDistributionFields from './FundDistributionFields';

const FundDistributionFieldsContainer = ({
  resources, formValues, disabled, required, totalAmount, currency,
}) => {
  const funds = getFundsForSelect(resources);

  return (
    <FundDistributionFields
      formValues={formValues}
      funds={funds}
      totalAmount={totalAmount}
      required={required}
      disabled={disabled}
      currency={currency}
    />
  );
};

FundDistributionFieldsContainer.manifest = Object.freeze({
  funds: {
    ...baseManifest,
    path: 'finance-storage/funds',
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
};

FundDistributionFieldsContainer.defaultProps = {
  disabled: false,
  required: true,
};

export default stripesConnect(FundDistributionFieldsContainer);
