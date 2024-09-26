import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  Field,
  useForm,
  useFormState,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  Checkbox,
  Col,
  Row,
} from '@folio/stripes/components';

import { FILED_NAMES } from './constants';
import { FieldCurrency } from '../Currency';
import CurrentExchangeRate from './CurrentExchangeRate';
import { TextField } from '../Fields';
import { TooltippedControl } from '../TooltippedControl';
import {
  IfFieldVisible,
  VisibilityControl,
} from '../VisibilityControl';
import { validateRequiredPositiveAmount } from '../utils';

const CurrencyExchangeRateFields = ({
  currencyFieldName,
  exchangeRate,
  exchangeRateFieldName,
  initialCurrency,
  isCurrencyRequired,
  isNonInteractive,
  isSetExchangeRateNonIntaractive,
  isTooltipTextExchangeRate,
  isUseExangeRateDisabled,
  hiddenFields,
  hiddenFieldsNamePrefix,
}) => {
  const [isExchangeRateEnabled, setExchangeRateEnabled] = useState();
  const [isExchangeRateRequired, setExchangeRateRequired] = useState();
  const stripes = useStripes();
  const { change } = useForm();
  const { values } = useFormState();

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

  const systemCurrency = stripes.currency;
  const filledCurrency = get(values, currencyFieldName);
  const isSetUseExangeRateDisabled = isUseExangeRateDisabled ||
    (filledCurrency === systemCurrency) || isExchangeRateRequired;
  const tooltipTextExchangeRate = !isExchangeRateEnabled && isTooltipTextExchangeRate &&
    <FormattedMessage id="stripes-acq-components.setExchangeRate.tooltip" />;
  const tooltipTextUseSetExchangeRate = isSetUseExangeRateDisabled && isTooltipTextExchangeRate &&
    <FormattedMessage id="stripes-acq-components.useSetExchangeRate.tooltip" />;

  return (
    <Row>
      <IfFieldVisible
        name={currencyFieldName}
        visible={!get(hiddenFields, currencyFieldName)}
      >
        <Col data-test-col-currency xs={3}>
          <VisibilityControl name={`${hiddenFieldsNamePrefix}.${currencyFieldName}`}>
            <FieldCurrency
              id="currency"
              name={currencyFieldName}
              onChange={onChangeCurrency}
              required={isCurrencyRequired}
              isNonInteractive={isNonInteractive}
              value={initialCurrency}
            />
          </VisibilityControl>
        </Col>
      </IfFieldVisible>
      <IfFieldVisible
        name={FILED_NAMES.currentExchangeRate}
        visible={!get(hiddenFields, FILED_NAMES.currentExchangeRate)}
      >
        <Col data-test-col-current-exchange-rate xs={3}>
          <VisibilityControl name={`${hiddenFieldsNamePrefix}.${FILED_NAMES.currentExchangeRate}`}>
            <CurrentExchangeRate
              label={<FormattedMessage id="stripes-acq-components.currentExchangeRate" />}
              exchangeFrom={filledCurrency}
              exchangeTo={systemCurrency}
              setExchangeRateEnabled={setExchangeRateEnabled}
              setExchangeRateRequired={setExchangeRateRequired}
            />
          </VisibilityControl>
        </Col>
      </IfFieldVisible>
      <IfFieldVisible
        name={FILED_NAMES.useSetExchangeRate}
        visible={!get(hiddenFields, FILED_NAMES.useSetExchangeRate)}
      >
        <Col data-test-col-use-set-exchange-rate xs={3}>
          <VisibilityControl name={`${hiddenFieldsNamePrefix}.${FILED_NAMES.useSetExchangeRate}`}>
            <TooltippedControl
              controlComponent={Checkbox}
              checked={isExchangeRateEnabled}
              data-testid="use-set-exchange-rate"
              readOnly={isSetUseExangeRateDisabled}
              id="use-set-exchange-rate"
              label={<FormattedMessage id="stripes-acq-components.useSetExchangeRate" />}
              onChange={enableExchangeRate}
              vertical
              fullWidth
              tooltipText={tooltipTextUseSetExchangeRate}
            />
          </VisibilityControl>
        </Col>
      </IfFieldVisible>
      <IfFieldVisible
        name={exchangeRateFieldName}
        visible={!get(hiddenFields, exchangeRateFieldName)}
      >
        <Col data-test-col-set-exchange-rate xs={3}>
          <VisibilityControl name={`${hiddenFieldsNamePrefix}.${exchangeRateFieldName}`}>
            <Field
              component={TextField}
              data-testid="exchange-rate"
              label={<FormattedMessage id="stripes-acq-components.setExchangeRate" />}
              id="exchange-rate"
              name={exchangeRateFieldName}
              type="number"
              readOnly={!isExchangeRateEnabled}
              tooltipText={tooltipTextExchangeRate}
              required={isExchangeRateRequired}
              validate={isExchangeRateRequired ? validateRequiredPositiveAmount : undefined}
              key={isExchangeRateRequired ? 1 : 0}
              isNonInteractive={isSetExchangeRateNonIntaractive ?? isNonInteractive}
            />
          </VisibilityControl>
        </Col>
      </IfFieldVisible>
    </Row>
  );
};

CurrencyExchangeRateFields.propTypes = {
  currencyFieldName: PropTypes.string,
  exchangeRate: PropTypes.number,
  exchangeRateFieldName: PropTypes.string,
  hiddenFields: PropTypes.object,
  hiddenFieldsNamePrefix: PropTypes.string,
  initialCurrency: PropTypes.string,
  isCurrencyRequired: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  isSetExchangeRateNonIntaractive: PropTypes.bool,
  isTooltipTextExchangeRate: PropTypes.bool,
  isUseExangeRateDisabled: PropTypes.bool,
};

CurrencyExchangeRateFields.defaultProps = {
  currencyFieldName: 'currency',
  exchangeRateFieldName: 'exchangeRate',
  hiddenFields: {},
  hiddenFieldsNamePrefix: 'hiddenFields',
  isCurrencyRequired: true,
  isNonInteractive: false,
  isTooltipTextExchangeRate: false,
  isUseExangeRateDisabled: false,
};

export default CurrencyExchangeRateFields;
