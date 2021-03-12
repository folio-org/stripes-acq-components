import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  calculateFundAmount,
  calculateFundDistributionTotal,
  getFundsForSelect,
  parseNumberFieldValue,
  validateFundDistributionFinal,
  validateRequired,
} from '../../utils';
import { TextField } from '../../Fields';
import { FieldSelectionFinal } from '../../FieldSelection';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { FUND_DISTR_TYPE } from '../../constants';
import { fundDistributionShape } from '../../shapes';
import { RepeatableFieldWithValidation } from '../../RepeatableFieldWithErrorMessage';
import { TypeToggle } from '../../TypeToggle';

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
}) => {
  const fundsForSelect = useMemo(() => getFundsForSelect(funds), [funds]);
  const distributionTotal = calculateFundDistributionTotal(fundDistribution, totalAmount, currency);
  const amounts = useMemo(() => fundDistribution.reduce((acc, distr, index) => {
    acc[index] = calculateFundAmount(distr, totalAmount, currency);

    return acc;
  }, {}), [currency, fundDistribution, totalAmount]);
  const remainingAmount = totalAmount - distributionTotal;
  const remainingAmountNode = (
    <>
      <FormattedMessage
        id="stripes-acq-components.fundDistribution.remainingAmount"
        values={{
          remainingAmount: (
            <AmountWithCurrencyField
              currency={currency}
              amount={remainingAmount}
            />
          ),
        }}
      />
    </>
  );

  const onAdd = (fields) => {
    fields.push({
      distributionType: FUND_DISTR_TYPE.percent,
      value: 100,
    });
  };

  const validate = useCallback((record) => {
    return validateFundDistributionFinal(record, totalAmount, currency);
  }, [currency, totalAmount]);

  const renderSubForm = useCallback((elem, index, fields) => {
    const selectFund = (selectedFundId) => {
      onSelectFund(elem, selectedFundId);
    };

    const { fundId, expenseClassId } = fields.value[index];
    const expenseClassesForSelect = expenseClassesByFundId[fundId]?.map(expenseClass => ({
      label: expenseClass.name,
      value: expenseClass.id,
    }));

    const hasSelectedFundAvailable = !fundId || fundsForSelect.some(({ value }) => value === fundId);
    let fundsOptions = fundsForSelect;

    if (!hasSelectedFundAvailable) {
      fundsOptions = [
        {
          value: fundId,
          label: <FormattedMessage id="stripes-acq-components.fundDistribution.unavailableFund" />,
        },
        ...fundsForSelect,
      ];
    }

    return (
      <Row>
        <Col xs>
          <FieldSelectionFinal
            dataOptions={fundsOptions}
            labelId="stripes-acq-components.fundDistribution.id"
            id={`${elem}.fundId`}
            name={`${elem}.fundId`}
            required={required}
            isNonInteractive={disabled}
            onChange={selectFund}
            validateFields={[]}
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
            />
          )}
        </Col>
        <Col xs>
          <Field
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
    fundsForSelect,
    name,
    onChangeToAmount,
    onChangeToPercent,
    onSelectFund,
    required,
  ]);

  return (
    <FieldArray
      key={`${currency}${totalAmount}`}
      addLabel={disabled ? null : <FormattedMessage id="stripes-acq-components.fundDistribution.addBtn" />}
      component={RepeatableFieldWithValidation}
      id={name}
      legend={remainingAmountNode}
      name={name}
      onAdd={onAdd}
      canAdd={!disabled}
      canRemove={!disabled}
      renderField={renderSubForm}
      validate={required ? validate : undefined}
    />
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
};

FundDistributionFieldsFinal.defaultProps = {
  disabled: false,
  fundDistribution: DEFAULT_FD,
  required: true,
};

export default FundDistributionFieldsFinal;
