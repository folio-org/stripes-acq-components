import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { isNil } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { useAsyncDebounce } from '../../hooks';
import {
  getFundsForSelect,
  parseNumberFieldValue,
  validateRequired,
} from '../../utils';
import { TextField } from '../../Fields';
import { FieldSelectionFinal } from '../../FieldSelection';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { FUND_DISTR_TYPE } from '../../constants';
import { fundDistributionShape } from '../../shapes';
import { RepeatableFieldWithValidation } from '../../RepeatableFieldWithErrorMessage';
import { TypeToggle } from '../../TypeToggle';
import { calculateAmountsAndTotal } from './calculateAmountsAndTotal';
import { handleValidationErrorResponse } from './handleValidationErrorResponse';
import {
  validateFundDistributionTotal,
  validateFundDistributionUniqueFunds,
} from './validateFundDistributionFinal';

const DEFAULT_FD = [];

const FundDistributionFieldsFinal = ({
  currency,
  disabled,
  expenseClassesByFundId,
  fundDistribution,
  funds,
  name,
  onChangeToAmount,
  onChangeToPercent,
  onSelectFund,
  required,
  totalAmount,
  validateFundDistributionTotal: validateFundDistributionTotalProp,
}) => {
  const intl = useIntl();
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [hasValidationError, setValidationError] = useState(false);

  const fundsForSelect = useMemo(() => {
    const activeFunds = funds.filter(({ fundStatus }) => fundStatus === 'Active');

    return getFundsForSelect(activeFunds);
  }, [funds]);
  const { amounts } = useMemo(
    () => calculateAmountsAndTotal(fundDistribution, totalAmount, currency),
    [currency, fundDistribution, totalAmount],
  );

  const remainingAmountNode = (
    <>
      <FormattedMessage
        id="stripes-acq-components.fundDistribution.remainingAmount"
        values={{
          remainingAmount: (
            <AmountWithCurrencyField
              currency={currency}
              amount={fundDistribution?.length ? remainingAmount : totalAmount}
            />
          ),
        }}
      />
    </>
  );

  const onAdd = useCallback((fields) => {
    fields.push({
      distributionType: FUND_DISTR_TYPE.percent,
      value: 100,
    });
  }, []);

  const onRemove = useCallback((fields, index) => {
    fields.remove(index);

    if (fields.length === 1) setRemainingAmount(0);
  }, []);

  const validate = useCallback(async (records) => {
    if (totalAmount != null && fundDistribution?.length) {
      const fundDistributionTotalValidator = validateFundDistributionTotalProp
        ? validateFundDistributionTotalProp.bind(null, records)
        : validateFundDistributionTotal.bind(null, records, totalAmount, currency);

      const remainingAmountError = records.some(({ fundId, value }) => isNil(fundId) || typeof value !== 'number')
        ? undefined
        : await fundDistributionTotalValidator()
          .then(() => setRemainingAmount(0))
          .catch(err => handleValidationErrorResponse(err, setRemainingAmount));

      const errors = [
        remainingAmountError,
        validateFundDistributionUniqueFunds(records),
      ].filter(Boolean);

      const error = required
        ? errors[0]
        : undefined;

      setValidationError(Boolean(error));

      return error;
    }

    return setValidationError(false);
  }, [
    currency,
    fundDistribution,
    required,
    totalAmount,
    validateFundDistributionTotalProp,
  ]);

  const debouncedValidate = useAsyncDebounce(validate, 500);

  const renderSubForm = useCallback((elem, index, fields) => {
    const selectFund = (selectedFundId) => {
      onSelectFund(elem, selectedFundId);
    };

    const { fundId, expenseClassId, value: fieldValue } = fields.value[index];

    const expenseClassesForSelect = expenseClassesByFundId[fundId]?.map(expenseClass => ({
      label: expenseClass.name,
      value: expenseClass.id,
    }));

    const hasSelectedFundAvailable = !fundId || fundsForSelect.some(({ value }) => value === fundId);
    const hasSelectedNotActiveFund = !hasSelectedFundAvailable && funds.some(({ id }) => id === fundId);
    const notActiveFund = hasSelectedNotActiveFund && funds.find(({ id }) => id === fundId);
    let fundsOptions = fundsForSelect;

    if (!hasSelectedFundAvailable) {
      fundsOptions = [
        {
          value: fundId,
          label: hasSelectedNotActiveFund
            ? `${notActiveFund.name} (${notActiveFund.code}) - ${intl.formatMessage({
              id: `stripes-acq-components.fundDistribution.fundStatus.${notActiveFund.fundStatus}`,
              defaultMessage: notActiveFund.fundStatus,
            })}`
            : <FormattedMessage id="stripes-acq-components.fundDistribution.unavailableFund" />,
        },
        ...fundsForSelect,
      ];
    }

    return (
      <Row key={fundId}>
        <Col xs>
          <FieldSelectionFinal
            dataOptions={fundsOptions}
            labelId="stripes-acq-components.fundDistribution.id"
            id={`${elem}.fundId`}
            name={`${elem}.fundId`}
            required={required}
            isNonInteractive={disabled}
            onChange={selectFund}
            validate={required ? validateRequired : undefined}
            validateFields={[name]}
            beforeSubmit={() => (required ? Boolean(fundId) : true)}
          />
        </Col>
        <Col xs>
          {!expenseClassesForSelect?.length ? null : (
            <FieldSelectionFinal
              dataOptions={expenseClassesForSelect}
              labelId="stripes-acq-components.fundDistribution.expenseClass"
              id={`${elem}.expenseClassId`}
              name={`${elem}.expenseClassId`}
              required={required}
              isNonInteractive={disabled}
              validateFields={[]}
              key={expenseClassId}
              beforeSubmit={() => (required ? Boolean(expenseClassId) : true)}
            />
          )}
        </Col>
        <Col xs>
          <Field
            data-testid="fundDistribution-value"
            component={TextField}
            fullWidth
            label={<FormattedMessage id="stripes-acq-components.fundDistribution.value" />}
            name={`${elem}.value`}
            type="number"
            parse={parseNumberFieldValue}
            required={required}
            validate={required ? validateRequired : undefined}
            isNonInteractive={disabled}
            validateFields={[name]}
            beforeSubmit={() => (required ? Boolean(fieldValue) : true)}
          />
        </Col>
        <Col xs>
          <Field
            component={TypeToggle}
            currency={currency}
            disabled={disabled}
            label={<FormattedMessage id="stripes-acq-components.fundDistribution.type" />}
            name={`${elem}.distributionType`}
            onChangeToAmount={onChangeToAmount}
            onChangeToPercent={onChangeToPercent}
            validateFields={[name]}
          />
        </Col>
        <Col xs>
          <KeyValue label={<FormattedMessage id="stripes-acq-components.fundDistribution.amount" />}>
            <AmountWithCurrencyField
              currency={currency}
              amount={amounts[index]}
            />
          </KeyValue>
        </Col>
      </Row>
    );
  }, [
    amounts,
    currency,
    disabled,
    expenseClassesByFundId,
    funds,
    fundsForSelect,
    intl,
    name,
    onChangeToAmount,
    onChangeToPercent,
    onSelectFund,
    required,
  ]);

  return (
    <>
      {
        hasValidationError && (
          <Field
            name={`${name}-error`}
            validate={() => true}
            validateFields={[]}
            render={() => <></>}
          />
        )
      }
      <FieldArray
        key={`${currency}${totalAmount}`}
        addLabel={disabled ? null : <FormattedMessage id="stripes-acq-components.fundDistribution.addBtn" />}
        component={RepeatableFieldWithValidation}
        id={name}
        legend={remainingAmountNode}
        name={name}
        onAdd={onAdd}
        onRemove={onRemove}
        canAdd={!disabled}
        canRemove={!disabled}
        renderField={renderSubForm}
        validate={debouncedValidate}
      />
    </>
  );
};

FundDistributionFieldsFinal.propTypes = {
  currency: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  expenseClassesByFundId: PropTypes.object.isRequired,
  fundDistribution: fundDistributionShape,
  funds: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  onChangeToAmount: PropTypes.func,
  onChangeToPercent: PropTypes.func,
  onSelectFund: PropTypes.func.isRequired,
  required: PropTypes.bool,
  totalAmount: PropTypes.number.isRequired,
  validateFundDistributionTotal: PropTypes.func.isRequired,
};

FundDistributionFieldsFinal.defaultProps = {
  disabled: false,
  fundDistribution: DEFAULT_FD,
  required: true,
};

export default FundDistributionFieldsFinal;
