import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  ButtonGroup,
  KeyValue,
} from '@folio/stripes/components';

import { FUND_DISTR_TYPE } from '../constants';
import { CurrencySymbol } from '../CurrencySymbol';

const TypeToggle = ({
  currency,
  disabled,
  input: { value, onChange, name },
  label,
  onChangeToAmount,
  onChangeToPercent,
}) => {
  const normalizedValue = value.replace(/"/g, '').toLowerCase();

  const switchToAmount = useCallback(() => {
    if (normalizedValue !== FUND_DISTR_TYPE.amount) {
      onChange(FUND_DISTR_TYPE.amount);
      if (onChangeToAmount) onChangeToAmount(name);
    }
  }, [name, onChange, onChangeToAmount, normalizedValue]);

  const switchToPercent = useCallback(() => {
    if (normalizedValue !== FUND_DISTR_TYPE.percent) {
      onChange(FUND_DISTR_TYPE.percent);
      if (onChangeToPercent) onChangeToPercent(name);
    }
  }, [name, onChange, onChangeToPercent, normalizedValue]);

  return (
    <KeyValue label={label}>
      <ButtonGroup
        fullWidth
        data-test-fund-distr-type
      >
        <Button
          onClick={switchToPercent}
          buttonStyle={normalizedValue === FUND_DISTR_TYPE.percent ? 'primary' : 'default'}
          data-test-fund-distr-type-percent
          disabled={disabled}
        >
          <FormattedMessage id="stripes-acq-components.fundDistribution.type.sign.percent" />
        </Button>
        <Button
          onClick={switchToAmount}
          buttonStyle={normalizedValue === FUND_DISTR_TYPE.amount ? 'primary' : 'default'}
          data-test-fund-distr-type-amount
          disabled={disabled}
        >
          <CurrencySymbol currency={currency} />
        </Button>
      </ButtonGroup>
    </KeyValue>
  );
};

TypeToggle.propTypes = {
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object.isRequired,
  label: PropTypes.node,
  onChangeToAmount: PropTypes.func,
  onChangeToPercent: PropTypes.func,
};

export default TypeToggle;
