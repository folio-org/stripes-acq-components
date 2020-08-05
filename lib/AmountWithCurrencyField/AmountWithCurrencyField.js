import React from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import { getAmountWithCurrency } from '../utils';

const AmountWithCurrencyField = ({ stripes, currency, amount = 0, showBrackets }) => {
  const usedCurrency = currency || stripes.currency;
  const usedAmount = showBrackets ? Math.abs(amount) : amount;

  return (
    <>
      {showBrackets && '('}
      {getAmountWithCurrency(stripes.locale, usedCurrency, usedAmount)}
      {showBrackets && ')'}
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
