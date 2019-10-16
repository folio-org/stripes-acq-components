import React from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

const CurrencySymbol = ({ stripes, currency = stripes.currency }) => {
  const config = {
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  };

  return Intl.NumberFormat('en', config).format(0).slice(0, -1);
};

CurrencySymbol.propTypes = {
  stripes: stripesShape.isRequired,
  currency: PropTypes.string,
};

export default withStripes(CurrencySymbol);
