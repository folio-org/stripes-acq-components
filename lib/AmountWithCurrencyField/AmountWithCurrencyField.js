import PropTypes from 'prop-types';

import { NoValue } from '@folio/stripes/components';
import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import { getAmountWithCurrency } from '../utils';

const AmountWithCurrencyField = ({
  amount,
  currency,
  showBrackets = false,
  stripes,
}) => {
  const usedCurrency = currency || stripes.currency;
  const usedAmount = showBrackets ? Math.abs(amount) : amount;

  return amount == null ? <NoValue /> : (
    <>
      {showBrackets && '('}
      {getAmountWithCurrency(stripes.locale, usedCurrency, usedAmount)}
      {showBrackets && ')'}
    </>
  );
};

AmountWithCurrencyField.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string,
  showBrackets: PropTypes.bool,
  stripes: stripesShape.isRequired,
};

export default withStripes(AmountWithCurrencyField);
