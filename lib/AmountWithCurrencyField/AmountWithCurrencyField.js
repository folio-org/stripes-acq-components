import React from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import { getAmountWithCurrency } from '../utils';

const AmountWithCurrencyField = ({ stripes, currency, amount = 0, showBrackets }) => {
  const usedCurrency = currency || stripes.currency;
  const withBrackets = showBrackets && amount < 0;
  const usedAmount = withBrackets ? Math.abs(amount) : amount;

  return (
    <>
      {withBrackets && '('}
      {getAmountWithCurrency(stripes.locale, usedCurrency, usedAmount)}
      {withBrackets && ')'}
    </>
  );
};

AmountWithCurrencyField.propTypes = {
  stripes: stripesShape.isRequired,
  currency: PropTypes.string,
  amount: PropTypes.number,
  showBrackets: PropTypes.bool,
};

AmountWithCurrencyField.defaultProps = {
  showBrackets: false,
}

export default withStripes(AmountWithCurrencyField);
