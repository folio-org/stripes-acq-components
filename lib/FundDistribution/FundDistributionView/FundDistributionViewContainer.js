import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { baseManifest } from '../../manifests';
import FundDistributionView from './FundDistributionView';
import { DICT_FUNDS } from '../../constants';

const FundDistributionViewContainer = ({
  resources, totalAmount, currency, fundDistributions,
}) => {
  const funds = get(resources, [DICT_FUNDS, 'records'], []);
  const fundsToDisplay = fundDistributions.map(distr => {
    const { name = '', code = '' } = funds.find(({ id }) => id === distr.fundId) || {};
    const fundName = `${name}${code ? `(${code})` : ''}`;

    return {
      ...distr,
      fundName,
    };
  });

  return (
    <FundDistributionView
      fundsToDisplay={fundsToDisplay}
      totalAmount={totalAmount}
      currency={currency}
    />
  );
};

FundDistributionViewContainer.manifest = Object.freeze({
  [DICT_FUNDS]: {
    ...baseManifest,
    path: 'finance-storage/funds',
    records: 'funds',
  },
});

FundDistributionViewContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  fundDistributions: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalAmount: PropTypes.number.isRequired,
  currency: PropTypes.string,
};

FundDistributionViewContainer.defaultProps = {};

export default stripesConnect(FundDistributionViewContainer);
