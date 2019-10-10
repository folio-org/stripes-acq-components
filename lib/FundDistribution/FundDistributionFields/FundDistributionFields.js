import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  FieldArray,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';
import sum from 'lodash/sum';

import {
  Button,
  ButtonGroup,
  Col,
  KeyValue,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';

import {
  validateRequired,
  calculateFundAmount,
  parseNumberFieldValue,
} from '../../utils';
import { FieldSelection } from '../../FieldSelection';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';
import { FUND_DISTR_TYPE } from '../../constants';
import { fundDistributionShape } from '../../shapes';

const FundDistributionFields = ({
  fundDistribution, funds, disabled, required, totalAmount, currency, name,
}) => {
  const amounts = fundDistribution.reduce((acc, distr) => {
    acc[distr.fundId] = calculateFundAmount(distr, totalAmount);

    return acc;
  }, {});
  const remainingAmount = totalAmount - sum(Object.values(amounts));
  const remainingAmountNode = (
    <React.Fragment>
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
    </React.Fragment>
  );

  const onAdd = (fields) => {
    fields.push({
      distributionType: FUND_DISTR_TYPE.percent,
    });
  };

  // eslint-disable-next-line react/prop-types
  const renderTypeToggle = ({ input: { value, onChange } }) => {
    return (
      <KeyValue label={<FormattedMessage id="stripes-acq-components.fundDistribution.type" />}>
        <ButtonGroup
          fullWidth
          data-test-fund-distr-type
        >
          <Button
            onClick={() => onChange(FUND_DISTR_TYPE.percent)}
            buttonStyle={value === FUND_DISTR_TYPE.percent ? 'primary' : 'default'}
            data-test-fund-distr-type-percent
            disabled={disabled}
          >
            <FormattedMessage id="stripes-acq-components.fundDistribution.type.sign.percent" />
          </Button>
          <Button
            onClick={() => onChange(FUND_DISTR_TYPE.amount)}
            buttonStyle={value === FUND_DISTR_TYPE.amount ? 'primary' : 'default'}
            data-test-fund-distr-type-amount
            disabled={disabled}
          >
            <FormattedMessage id="stripes-acq-components.fundDistribution.type.sign.amount" />
          </Button>
        </ButtonGroup>
      </KeyValue>
    );
  };

  const renderSubForm = (elem, index, fields) => {
    const fund = fields.get(index);

    return (
      <Row>
        <Col xs>
          <FieldSelection
            dataOptions={funds}
            labelId="stripes-acq-components.fundDistribution.id"
            name={`${elem}.fundId`}
            required={required}
            disabled={disabled}
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
              amount={amounts[fund.fundId]}
            />
          </KeyValue>
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="stripes-acq-components.fundDistribution.addBtn" />}
      component={RepeatableField}
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
  currency: PropTypes.string,
  disabled: PropTypes.bool,
  fundDistribution: fundDistributionShape,
  funds: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  totalAmount: PropTypes.number.isRequired,
};

FundDistributionFields.defaultProps = {
  disabled: false,
  fundDistribution: [],
  required: true,
};

export default FundDistributionFields;
