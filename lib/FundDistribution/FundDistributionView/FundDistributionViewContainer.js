import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';

import { fundsManifest, transactionsManifest } from '../../manifests';
import FundDistributionView from './FundDistributionView';
import { DICT_FUNDS } from '../../constants';
import { fundDistributionShape } from '../../shapes';

const FundDistributionViewContainer = ({
  mutator, totalAmount, currency, fundDistributions, stripes,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [funds, setFunds] = useState();
  const [fundsToDisplay, setFundsToDisplay] = useState([]);

  useEffect(
    () => {
      setIsLoading(true);
      setFundsToDisplay([]);

      const fundsPromise = funds ? Promise.resolve(funds) : mutator[DICT_FUNDS].GET();
      const encumbrancesPromise = mutator.fundDistributionEncumbrances.GET({
        params: {
          query: fundDistributions
            .filter(({ encumbrance }) => encumbrance)
            .map(({ encumbrance }) => `id==${encumbrance}`),
        },
      });

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
      fundsToDisplay={fundsToDisplay}
      totalAmount={totalAmount}
      currency={currency || stripes.currency}
    />
  );
};

FundDistributionViewContainer.manifest = Object.freeze({
  [DICT_FUNDS]: {
    ...fundsManifest,
    accumulate: true,
  },
  fundDistributionEncumbrances: transactionsManifest,
});

FundDistributionViewContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  fundDistributions: fundDistributionShape.isRequired,
  totalAmount: PropTypes.number,
  currency: PropTypes.string,
  stripes: PropTypes.object.isRequired,
};

FundDistributionViewContainer.defaultProps = {
  totalAmount: 0,
};

export default stripesConnect(FundDistributionViewContainer);
