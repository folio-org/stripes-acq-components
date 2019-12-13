import React from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { getFundsForSelect } from '../../utils';
import { fundsManifest } from '../../manifests';
import FundDistributionFields from './FundDistributionFields';
import { DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';

const FundDistributionFieldsContainer = ({
  resources, fundDistribution, disabled, required, totalAmount, currency, name, stripes,
}) => {
  const funds = getFundsForSelect(resources);

  return (
    <FundDistributionFields
      currency={currency || stripes.currency}
      disabled={disabled}
      fundDistribution={fundDistribution}
      funds={funds}
      name={name}
      required={required}
      totalAmount={totalAmount}
      stripes={stripes}
    />
  );
};

FundDistributionFieldsContainer.manifest = Object.freeze({
  [DICT_FUNDS]: fundsManifest,
});

FundDistributionFieldsContainer.propTypes = {
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  fundDistribution: fundDistributionShape,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  totalAmount: PropTypes.number,
};

FundDistributionFieldsContainer.defaultProps = {
  disabled: false,
  required: true,
  totalAmount: 0,
};

export default stripesConnect(FundDistributionFieldsContainer);
