import React from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import { getAmountWithCurrency } from '../utils';

const AmountWithCurrencyField = ({ stripes, currency, amount = 0 }) => {
  const usedCurrency = currency || stripes.currency;

  return (
    <React.Fragment>
      {getAmountWithCurrency(stripes.locale, usedCurrency, amount)}
    </React.Fragment>
  );
};

AmountWithCurrencyField.propTypes = {
  stripes: stripesShape.isRequired,
  currency: PropTypes.string,
  amount: PropTypes.number,
};

export default withStripes(AmountWithCurrencyField);
