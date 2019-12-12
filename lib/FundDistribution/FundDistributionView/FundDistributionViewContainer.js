import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { fundsManifest } from '../../manifests';
import FundDistributionView from './FundDistributionView';
import { DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';

const FundDistributionViewContainer = ({
  resources, totalAmount, currency, fundDistributions, stripes,
}) => {
  if (!get(resources, [DICT_FUNDS, 'hasLoaded'])) return null;
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
      stripes={stripes}
    />
  );
};

FundDistributionViewContainer.manifest = Object.freeze({
  [DICT_FUNDS]: fundsManifest,
});

FundDistributionViewContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  fundDistributions: fundDistributionShape.isRequired,
  totalAmount: PropTypes.number,
  currency: PropTypes.string,
  stripes: PropTypes.object.isRequired,
};

FundDistributionViewContainer.defaultProps = {
  totalAmount: 0,
};

export default stripesConnect(FundDistributionViewContainer);
