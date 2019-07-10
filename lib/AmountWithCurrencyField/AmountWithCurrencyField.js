import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import { getAmountWithCurrency } from '../utils';

const AmountWithCurrencyField = ({ stripes: { locale }, currency, amount = 0 }) => (
  <Fragment>
    {getAmountWithCurrency(locale, currency, amount)}
  </Fragment>
);

AmountWithCurrencyField.propTypes = {
  stripes: stripesShape.isRequired,
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number,
};

export default withStripes(AmountWithCurrencyField);
