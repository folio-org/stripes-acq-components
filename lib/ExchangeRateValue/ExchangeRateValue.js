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
  labelId = 'stripes-acq-components.exchangeRate',
  manualExchangeRate,
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
  labelId: PropTypes.string,
  manualExchangeRate: PropTypes.number,
  name: PropTypes.string,
};

export default ExchangeRateValue;
