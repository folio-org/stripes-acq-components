import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { fundsManifest, transactionsManifest, expenseClassesManifest } from '../../manifests';
import FundDistributionView from './FundDistributionView';
import { DICT_EXPENSE_CLASSES, DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';
import { batchFetch } from '../../utils';

const FUND_DISTRIBUTIONS_DEFAULT = [];

const FundDistributionViewContainer = ({
  mutator, totalAmount, currency, fundDistributions, stripes, resources,
}) => {
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

          setFundsToDisplay(fundDistributions.map(distr => {
            const { name = '', code = '' } = fundsResponse.find(({ id }) => id === distr.fundId) || {};
            const fundName = `${name}${code ? `(${code})` : ''}`;
            const fundEncumbrance = encumbrancesResponse.find(({ id }) => id === distr.encumbrance);

            return {
              ...distr,
              fundName,
              fundEncumbrance,
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

  if (isLoading) return null;

  return (
    <FundDistributionView
      expenseClasses={expenseClasses}
      fundsToDisplay={fundsToDisplay}
      totalAmount={totalAmount}
      currency={currency || stripes.currency}
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
  mutator: PropTypes.object.isRequired,
  fundDistributions: fundDistributionShape,
  totalAmount: PropTypes.number,
  currency: PropTypes.string,
  stripes: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

FundDistributionViewContainer.defaultProps = {
  fundDistributions: FUND_DISTRIBUTIONS_DEFAULT,
  totalAmount: 0,
};

export default stripesConnect(FundDistributionViewContainer);
