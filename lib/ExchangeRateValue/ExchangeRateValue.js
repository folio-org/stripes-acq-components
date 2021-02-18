import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Label,
  Loading,
} from '@folio/stripes/components';

import { useExchangeRateValue } from './useExchangeRateValue';

const ExchangeRateValue = ({
  exchangeFrom,
  exchangeTo,
  manualExchangeRate,
  labelId,
}) => {
  const label = <FormattedMessage id={labelId} />;

  const { isLoading, exchangeRate } = useExchangeRateValue(exchangeFrom, exchangeTo, manualExchangeRate);

  if (isLoading) {
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
    <KeyValue
      label={label}
      value={exchangeRate}
    />
  );
};

ExchangeRateValue.propTypes = {
  exchangeFrom: PropTypes.string.isRequired,
  exchangeTo: PropTypes.string.isRequired,
  manualExchangeRate: PropTypes.number,
  labelId: PropTypes.string,
};

ExchangeRateValue.defaultProps = {
  labelId: 'stripes-acq-components.exchangeRate',
};

export default ExchangeRateValue;
