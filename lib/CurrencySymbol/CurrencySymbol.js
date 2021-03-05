import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

const WRONG_CURRENCY_VALUE = '-';

const CurrencySymbol = ({ stripes, currency }) => {
  const config = {
    currency: currency || stripes.currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  };

  try {
    return Intl.NumberFormat('en', config).format(0).slice(0, -1);
  } catch {
    return WRONG_CURRENCY_VALUE;
  }
};

CurrencySymbol.propTypes = {
  stripes: stripesShape.isRequired,
  currency: PropTypes.string,
};

export default withStripes(CurrencySymbol);
