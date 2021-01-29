import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

const CurrencyValue = ({ value }) => {
  const intl = useIntl();

  return (
    <KeyValue
      label={intl.formatMessage({ id: 'stripes-acq-components.currency' })}
      value={intl.formatDisplayName(value, { type: 'currency' })}
    />
  );
};

CurrencyValue.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CurrencyValue;
