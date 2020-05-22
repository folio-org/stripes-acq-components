import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  FieldArray,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
  Col,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';

import {
  validateRequired,
  calculateFundAmount,
  parseNumberFieldValue,
  calculateFundDistributionTotal,
} from '../../utils';
import { FieldSelection } from '../../FieldSelection';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { FUND_DISTR_TYPE } from '../../constants';
import { fundDistributionShape } from '../../shapes';
import { RepeatableFieldWithErrorMessage } from '../../RepeatableFieldWithErrorMessage';
import { CurrencySymbol } from '../../CurrencySymbol';

const FundDistributionFields = ({
  fundDistribution, funds, disabled, required, totalAmount, currency, name, onSelectFund,
}) => {
  const distributionTotal = calculateFundDistributionTotal(fundDistribution, totalAmount, currency);
  const amounts = fundDistribution.reduce((acc, distr, index) => {
    acc[index] = calculateFundAmount(distr, totalAmount, currency);

    return acc;
  }, {});
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
    });
  };

  const renderTypeToggle = useCallback(({ input: { value, onChange } }) => {
    return (
      <KeyValue label={<FormattedMessage id="stripes-acq-components.fundDistribution.type" />}>
        <ButtonGroup
          fullWidth
          data-test-fund-distr-type
        >
          <Button
            onClick={() => value !== FUND_DISTR_TYPE.percent && onChange(FUND_DISTR_TYPE.percent)}
            buttonStyle={value === FUND_DISTR_TYPE.percent ? 'primary' : 'default'}
            data-test-fund-distr-type-percent
            disabled={disabled}
          >
            <FormattedMessage id="stripes-acq-components.fundDistribution.type.sign.percent" />
          </Button>
          <Button
            onClick={() => value !== FUND_DISTR_TYPE.amount && onChange(FUND_DISTR_TYPE.amount)}
            buttonStyle={value === FUND_DISTR_TYPE.amount ? 'primary' : 'default'}
            data-test-fund-distr-type-amount
            disabled={disabled}
          >
            <CurrencySymbol currency={currency} />
          </Button>
        </ButtonGroup>
      </KeyValue>
    );
  }, [currency, disabled]);

  const renderSubForm = (elem, index) => {
    return (
      <Row>
        <Col xs>
          <FieldSelection
            dataOptions={funds}
            labelId="stripes-acq-components.fundDistribution.id"
            name={`${elem}.fundId`}
            required={required}
            disabled={disabled}
            onChange={onSelectFund}
          />
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
            validate={required ? [validateRequired] : undefined}
            disabled={disabled}
          />
        </Col>
        <Col xs>
          <Field
            label="label"
            name={`${elem}.distributionType`}
            component={renderTypeToggle}
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
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="stripes-acq-components.fundDistribution.addBtn" />}
      component={RepeatableFieldWithErrorMessage}
      id={name}
      legend={remainingAmountNode}
      name={name}
      onAdd={onAdd}
      props={{
        canAdd: !disabled,
        canRemove: !disabled,
      }}
      renderField={renderSubForm}
    />
  );
};

FundDistributionFields.propTypes = {
  currency: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  fundDistribution: fundDistributionShape,
  funds: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  onSelectFund: PropTypes.func.isRequired,
  required: PropTypes.bool,
  totalAmount: PropTypes.number.isRequired,
};

FundDistributionFields.defaultProps = {
  disabled: false,
  fundDistribution: [],
  required: true,
};

export default FundDistributionFields;
