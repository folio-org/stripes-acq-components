import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Loading,
} from '@folio/stripes/components';

import { useExchangeRateValue } from '../hooks';

const ExchangeRateValue = ({
  component,
  exchangeFrom,
  exchangeTo,
  manualExchangeRate,
  labelId,
  name,
}) => {
  const { isLoading, exchangeRate } = useExchangeRateValue(exchangeFrom, exchangeTo, manualExchangeRate);

  const Component = component || KeyValue;

  return (
    <Component
      label={<FormattedMessage id={labelId} />}
      name={name}
    >
      {isLoading ? <Loading /> : exchangeRate}
    </Component>
  );
};

ExchangeRateValue.propTypes = {
  component: PropTypes.node,
  exchangeFrom: PropTypes.string,
  exchangeTo: PropTypes.string.isRequired,
  manualExchangeRate: PropTypes.number,
  labelId: PropTypes.string,
  name: PropTypes.string,
};

ExchangeRateValue.defaultProps = {
  labelId: 'stripes-acq-components.exchangeRate',
};

export default ExchangeRateValue;
