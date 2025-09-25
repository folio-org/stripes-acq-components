import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { Loading } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { fundDistributionShape } from '../../shapes';
import { calculateAmountsAndTotal } from '../FundDistributionFields/calculateAmountsAndTotal';
import { calculateAdjustmentAmounts } from './calculateAdjustmentAmounts';
import FundDistributionView from './FundDistributionView';
import { useFundsDistribution } from './useFundsDistribution';

const FUND_DISTRIBUTIONS_DEFAULT = [];

const FundDistributionViewContainer = ({
  totalAmount = 0,
  fundDistributions = FUND_DISTRIBUTIONS_DEFAULT,
  currency: currencyProp,
  groupBy,
  mclProps,
  name: nameProp,
}) => {
  const stripes = useStripes();

  const currency = currencyProp || stripes.currency;

  const {
    fundsDistribution,
    isFetching,
  } = useFundsDistribution(fundDistributions);

  const { amounts } = useMemo(() => (groupBy
    ? calculateAdjustmentAmounts(fundDistributions, groupBy, currency)
    : calculateAmountsAndTotal(fundDistributions, totalAmount, currency)
  ), [currency, fundDistributions, totalAmount, groupBy]);

  if (isFetching) return <Loading />;

  return (
    <FundDistributionView
      amounts={amounts}
      currency={currency}
      fundsToDisplay={fundsDistribution}
      mclProps={mclProps}
      name={nameProp}
    />
  );
};

FundDistributionViewContainer.propTypes = {
  currency: PropTypes.string,
  fundDistributions: fundDistributionShape,
  groupBy: PropTypes.string,
  mclProps: PropTypes.object,
  name: PropTypes.string,
  totalAmount: PropTypes.number,
};

export default FundDistributionViewContainer;
