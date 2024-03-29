import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  Label,
  Layout,
  Loading,
} from '@folio/stripes/components';

import { EXCHANGE_RATE_API } from '../../constants';

const CurrentExchangeRate = ({
  label,
  exchangeFrom,
  exchangeTo,
  mutator,
  setExchangeRateRequired,
  setExchangeRateEnabled,
}) => {
  const [exchangeRate, setExchangeRate] = useState();

  useEffect(
    () => {
      setExchangeRate();
      setExchangeRateRequired(false);
      setExchangeRateEnabled(false);

      if (exchangeFrom && exchangeFrom !== exchangeTo) {
        mutator.exchangeRate.GET({
          params: {
            from: exchangeFrom,
            to: exchangeTo,
          },
        })
          .then(setExchangeRate)
          .catch(() => {
            setExchangeRate({});
            setExchangeRateRequired(true);
            setExchangeRateEnabled(true);
          });
      } else setExchangeRate({});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exchangeFrom, exchangeTo, setExchangeRateRequired, setExchangeRateEnabled],
  );

  if (!exchangeRate) {
    return (
      <>
        <Label>
          {label}
        </Label>
        <Loading />
      </>
    );
  }

  return (
    <Layout className="full">
      <KeyValue
        data-testid="current-exchange-rate"
        label={label}
        value={exchangeRate?.exchangeRate}
      />
    </Layout>
  );
};

CurrentExchangeRate.manifest = Object.freeze({
  exchangeRate: {
    accumulate: true,
    fetch: false,
    throwErrors: false,
    type: 'okapi',
    path: EXCHANGE_RATE_API,
  },
});

CurrentExchangeRate.propTypes = {
  exchangeFrom: PropTypes.string,
  exchangeTo: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
  setExchangeRateRequired: PropTypes.func.isRequired,
  setExchangeRateEnabled: PropTypes.func.isRequired,
};

export default stripesConnect(CurrentExchangeRate);
