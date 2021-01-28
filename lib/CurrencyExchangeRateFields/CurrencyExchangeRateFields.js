import React, { useState, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Checkbox,
  Col,
  Row,
} from '@folio/stripes/components';

import { TextField } from '../Fields';
import { TooltippedControl } from '../TooltippedControl';
import { validateRequired } from '../utils';
import { FieldCurrency } from '../Currency';
import CurrentExchangeRate from './CurrentExchangeRate';

const CurrencyExchangeRateFields = ({
  change,
  currencyFieldName,
  currencyRequired,
  exchangeRate,
  exchangeRateFieldName,
  filledCurrency,
  initialCurrency,
  isNonInteractive,
  isTooltipTextExchangeRate,
  isUseExangeRateDisabled,
  systemCurrency,
}) => {
  const [isExchangeRateEnabled, setExchangeRateEnabled] = useState();
  const [isExchangeRateRequired, setExchangeRateRequired] = useState();

  useEffect(() => setExchangeRateEnabled(Boolean(exchangeRate)), [exchangeRate]);

  const resetExchangeRate = useCallback(() => change(exchangeRateFieldName, null), [change, exchangeRateFieldName]);
  const enableExchangeRate = useCallback(
    ({ target: { checked } }) => {
      setExchangeRateEnabled(checked);

      return checked ? undefined : resetExchangeRate();
    },
    [resetExchangeRate],
  );
  const onChangeCurrency = useCallback((value) => {
    change(currencyFieldName, value);
    resetExchangeRate();
  }, [change, resetExchangeRate, currencyFieldName]);

  const isSetUseExangeRateDisabled = isUseExangeRateDisabled ||
    (filledCurrency === systemCurrency) || isExchangeRateRequired;
  const tooltipTextExchangeRate = !isExchangeRateEnabled && isTooltipTextExchangeRate &&
    <FormattedMessage id="stripes-acq-components.setExchangeRate.tooltip" />;
  const tooltipTextUseSetExchangeRate = isSetUseExangeRateDisabled && isTooltipTextExchangeRate &&
    <FormattedMessage id="stripes-acq-components.useSetExchangeRate.tooltip" />;

  return (
    <Row>
      <Col data-test-col-currency xs={3}>
        <FieldCurrency
          id="currency"
          name={currencyFieldName}
          onChange={onChangeCurrency}
          required={currencyRequired}
          isNonInteractive={isNonInteractive}
          value={initialCurrency}
        />
      </Col>
      <Col data-test-col-current-exchange-rate xs={3}>
        <CurrentExchangeRate
          label={<FormattedMessage id="stripes-acq-components.currentExchangeRate" />}
          exchangeFrom={filledCurrency}
          exchangeTo={systemCurrency}
          setExchangeRateEnabled={setExchangeRateEnabled}
          setExchangeRateRequired={setExchangeRateRequired}
        />
      </Col>
      <Col data-test-col-use-set-exchange-rate xs={3}>
        <TooltippedControl
          controlComponent={Checkbox}
          checked={isExchangeRateEnabled}
          readOnly={isSetUseExangeRateDisabled}
          id="use-set-exhange-rate"
          label={<FormattedMessage id="stripes-acq-components.useSetExchangeRate" />}
          onChange={enableExchangeRate}
          vertical
          tooltipText={tooltipTextUseSetExchangeRate}
        />
      </Col>
      <Col data-test-col-set-exchange-rate xs={3}>
        <Field
          component={TextField}
          label={<FormattedMessage id="stripes-acq-components.setExchangeRate" />}
          id="exchange-rate"
          name={exchangeRateFieldName}
          type="number"
          readOnly={!isExchangeRateEnabled}
          tooltipText={tooltipTextExchangeRate}
          required={isExchangeRateRequired}
          validate={isExchangeRateRequired ? validateRequired : undefined}
          key={isExchangeRateRequired ? 1 : 0}
          isNonInteractive={isNonInteractive}
        />
      </Col>
    </Row>
  );
};

CurrencyExchangeRateFields.propTypes = {
  change: PropTypes.func.isRequired,
  currencyFieldName: PropTypes.string,
  currencyRequired: PropTypes.bool,
  exchangeRate: PropTypes.number,
  exchangeRateFieldName: PropTypes.string,
  filledCurrency: PropTypes.string,
  initialCurrency: PropTypes.string,
  isNonInteractive: PropTypes.bool,
  isTooltipTextExchangeRate: PropTypes.bool,
  isUseExangeRateDisabled: PropTypes.bool,
  systemCurrency: PropTypes.string,
};

CurrencyExchangeRateFields.defaultProps = {
  currencyFieldName: 'currency',
  currencyRequired: false,
  exchangeRateFieldName: 'exchangeRate',
  isNonInteractive: false,
  isTooltipTextExchangeRate: false,
  isUseExangeRateDisabled: false,
};

export default CurrencyExchangeRateFields;
