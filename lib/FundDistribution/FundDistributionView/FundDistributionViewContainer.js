import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';

import { calculateAmountsAndTotal } from '../FundDistributionFields/calculateAmountsAndTotal';
import { fundsManifest, transactionsManifest, expenseClassesManifest } from '../../manifests';
import FundDistributionView from './FundDistributionView';
import {
  BUDGETS_API,
  DICT_EXPENSE_CLASSES,
  DICT_FUNDS,
} from '../../constants';
import { fundDistributionShape } from '../../shapes';
import {
  batchFetch,
  batchRequest,
} from '../../utils';
import { calculateAdjustmentAmounts } from './calculateAdjustmentAmounts';

const FUND_DISTRIBUTIONS_DEFAULT = [];

const FundDistributionViewContainer = ({
  mutator,
  totalAmount,
  fundDistributions,
  stripes,
  currency = stripes.currency,
  resources,
  groupBy,
  mclProps,
}) => {
  const ky = useOkapiKy();
  const [isLoading, setIsLoading] = useState(true);
  const [funds, setFunds] = useState();
  const [fundsToDisplay, setFundsToDisplay] = useState([]);
  const expenseClasses = resources?.[DICT_EXPENSE_CLASSES]?.records;

  useEffect(
    () => {
      setIsLoading(true);
      setFundsToDisplay([]);

      const fundsPromise = funds ? Promise.resolve(funds) : mutator[DICT_FUNDS].GET();
      const encumbrancesPromise = batchFetch(
        mutator.fundDistributionEncumbrances,
        fundDistributions
          .filter(({ encumbrance }) => encumbrance)
          .map(({ encumbrance }) => encumbrance),
      );

      Promise.all([fundsPromise, encumbrancesPromise])
        .then(([fundsResponse, encumbrancesResponse]) => {
          setFunds(fundsResponse);

          const budgetsPromise = batchRequest(
            ({ params: searchParams }) => ky.get(BUDGETS_API, { searchParams }).json().then((resp) => resp.budgets),
            encumbrancesResponse,
            (itemsChunk) => {
              const query = itemsChunk
                .map(({ fromFundId, fiscalYearId }) => `(fundId==${fromFundId} and fiscalYearId==${fiscalYearId})`)
                .join(' or ');

              return query || '';
            },
          );

          return Promise.all([fundsResponse, encumbrancesResponse, budgetsPromise]);
        })
        .then(([fundsResponse, encumbrancesResponse, budgetsResponse]) => {
          setFundsToDisplay(fundDistributions.map(distr => {
            const { name = '', code = '' } = fundsResponse.find(({ id }) => id === distr.fundId) || {};
            const fundName = `${name}${code ? `(${code})` : ''}`;
            const fundEncumbrance = encumbrancesResponse.find(({ id }) => id === distr.encumbrance);
            const fundBudget = budgetsResponse.find(({ fundId }) => fundId === distr.fundId);

            return {
              ...distr,
              fundName,
              fundEncumbrance,
              fundBudget,
            };
          }));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fundDistributions],
  );

  const { amounts } = useMemo(() => (groupBy
    ? calculateAdjustmentAmounts(fundDistributions, groupBy, currency)
    : calculateAmountsAndTotal(fundDistributions, totalAmount, currency)
  ), [currency, fundDistributions, totalAmount, groupBy]);

  if (isLoading) return null;

  return (
    <FundDistributionView
      amounts={amounts}
      expenseClasses={expenseClasses}
      fundsToDisplay={fundsToDisplay}
      totalAmount={totalAmount}
      currency={currency}
      mclProps={mclProps}
    />
  );
};

FundDistributionViewContainer.manifest = Object.freeze({
  [DICT_EXPENSE_CLASSES]: expenseClassesManifest,
  [DICT_FUNDS]: {
    ...fundsManifest,
    accumulate: true,
  },
  fundDistributionEncumbrances: transactionsManifest,
});

FundDistributionViewContainer.propTypes = {
  mclProps: PropTypes.object,
  mutator: PropTypes.object.isRequired,
  fundDistributions: fundDistributionShape,
  totalAmount: PropTypes.number,
  currency: PropTypes.string,
  stripes: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  groupBy: PropTypes.string,
};

FundDistributionViewContainer.defaultProps = {
  fundDistributions: FUND_DISTRIBUTIONS_DEFAULT,
  totalAmount: 0,
};

export default stripesConnect(FundDistributionViewContainer);
