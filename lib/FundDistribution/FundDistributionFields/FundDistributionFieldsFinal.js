import identity from 'lodash/identity';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  getFundsForSelect,
  parseNumberFieldValue,
  validateRequired,
} from '../../utils';
import { TextField } from '../../Fields';
import { FieldSelectionFinal } from '../../FieldSelection';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { RepeatableFieldWithValidation } from '../../RepeatableFieldWithErrorMessage';
import { TypeToggle } from '../../TypeToggle';

const getValidateFields = (validateFieldsConfig, arrayField, defaultValue) => {
  if (typeof validateFieldsConfig === 'function') {
    return validateFieldsConfig(arrayField);
  }

  return validateFieldsConfig || defaultValue;
};

const FundDistributionFieldsFinal = ({
  amounts,
  currency,
  disabled = false,
  expenseClassesByFundId,
  filterFunds = identity,
  funds,
  hasValidationError = false,
  legend,
  name,
  onAdd,
  onChangeToAmount,
  onChangeToPercent,
  onExpenseClassChange,
  onRemove,
  onSelectFund,
  required = true,
  totalAmount,
  validate,
  validateFieldsMap,
}) => {
  const intl = useIntl();

  const fundsForSelect = useMemo(() => {
    const activeFunds = funds.filter(({ fundStatus }) => fundStatus === 'Active');

    return getFundsForSelect(filterFunds(activeFunds));
  }, [filterFunds, funds]);

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

    const expenseClassExtraProps = {
      ...(
        onExpenseClassChange
          ? {
            onChange: (value) => onExpenseClassChange({
              fieldName: `${elem}.expenseClassId`,
              parentFieldName: elem,
              value,
            }),
          }
          : {}
      ),
    };

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
            validateFields={getValidateFields(validateFieldsMap?.fundId, elem, [name])}
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
              validateFields={getValidateFields(validateFieldsMap?.expenseClassId, elem, [])}
              key={expenseClassId}
              beforeSubmit={() => (required ? Boolean(expenseClassId) : true)}
              {...expenseClassExtraProps}
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
            validateFields={getValidateFields(validateFieldsMap?.value, elem, [name])}
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
            validateFields={getValidateFields(validateFieldsMap?.distributionType, elem, [name])}
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
    onExpenseClassChange,
    onSelectFund,
    required,
    validateFieldsMap,
  ]);

  return (
    <>
      {
        // This is a workaround to show validation error message for the whole fund distribution field array
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
        legend={legend}
        name={name}
        onAdd={onAdd}
        onRemove={onRemove}
        canAdd={!disabled}
        canRemove={!disabled}
        renderField={renderSubForm}
        validate={validate}
      />
    </>
  );
};

FundDistributionFieldsFinal.propTypes = {
  amounts: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  expenseClassesByFundId: PropTypes.object.isRequired,
  filterFunds: PropTypes.func,
  funds: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasValidationError: PropTypes.bool,
  legend: PropTypes.node,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChangeToAmount: PropTypes.func,
  onChangeToPercent: PropTypes.func,
  onExpenseClassChange: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  onSelectFund: PropTypes.func.isRequired,
  required: PropTypes.bool,
  totalAmount: PropTypes.number.isRequired,
  validate: PropTypes.func,
  validateFieldsMap: PropTypes.shape({
    fundId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
    expenseClassId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
    distributionType: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  }),
};

export default FundDistributionFieldsFinal;
