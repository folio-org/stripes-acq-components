import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
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

import { FieldCurrency } from '../Currency';
import CurrentExchangeRate from './CurrentExchangeRate';
import { TextField } from '../Fields';
import { TooltippedControl } from '../TooltippedControl';
import { validateRequired } from '../utils';
import {
  IfFieldVisible,
  VisibilityControl,
} from '../VisibilityControl';
import { FILED_NAMES } from './constants';

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

  const visibleFields = useMemo(() => ({
    currency: !get(hiddenFields, currencyFieldName, ''),
    currentExchangeRate: !get(hiddenFields, FILED_NAMES.currentExchangeRate, ''),
    useSetExchangeRate: !get(hiddenFields, FILED_NAMES.useSetExchangeRate, ''),
    exchangeRate: !get(hiddenFields, exchangeRateFieldName, ''),
  }), [currencyFieldName, exchangeRateFieldName, hiddenFields]);

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
      <IfFieldVisible visible={visibleFields.currency} name={currencyFieldName}>
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
      <IfFieldVisible visible={visibleFields.currentExchangeRate} name={FILED_NAMES.currentExchangeRate}>
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
      <IfFieldVisible visible={visibleFields.useSetExchangeRate} name={FILED_NAMES.useSetExchangeRate}>
        <Col data-test-col-use-set-exchange-rate xs={3}>
          <VisibilityControl name={`${hiddenFieldsNamePrefix}.${FILED_NAMES.useSetExchangeRate}`}>
            <TooltippedControl
              controlComponent={Checkbox}
              checked={isExchangeRateEnabled}
              data-testid="use-set-exhange-rate"
              readOnly={isSetUseExangeRateDisabled}
              id="use-set-exhange-rate"
              label={<FormattedMessage id="stripes-acq-components.useSetExchangeRate" />}
              onChange={enableExchangeRate}
              vertical
              fullWidth
              tooltipText={tooltipTextUseSetExchangeRate}
            />
          </VisibilityControl>
        </Col>
      </IfFieldVisible>
      <IfFieldVisible visible={visibleFields.exchangeRate} name={exchangeRateFieldName}>
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
              validate={isExchangeRateRequired ? validateRequired : undefined}
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
