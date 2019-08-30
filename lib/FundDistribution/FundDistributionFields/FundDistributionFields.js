import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  FieldArray,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

import {
  validateRequired,
  calculateFundAmount,
} from '../../utils';
import { FieldSelect } from '../../FieldSelect';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';

const FundDistributionFields = ({
  funds, formValues, disabled, required, totalAmount, currency,
}) => {
  const renderSubForm = (elem, index, fields) => {
    const fund = fields.get(index);
    const fundCode = get(funds.find(({ value }) => value === fund.fundId), 'code');

    return (
      <Row>
        <Col xs={4}>
          <FieldSelect
            dataOptions={funds}
            label={<FormattedMessage id="stripes-acq-components.fundDistribution.id" />}
            name={`${elem}.fundId`}
            required={required}
            validate={required && [validateRequired]}
            disabled={disabled}
          />
        </Col>
        <Col xs={2}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="stripes-acq-components.fundDistribution.percent" />}
            name={`${elem}.percentage`}
            type="number"
            required={required}
            validate={required && [validateRequired]}
            disabled={disabled}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="stripes-acq-components.fundDistribution.code" />}
            value={fundCode}
          />
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="stripes-acq-components.fundDistribution.amount" />}>
            <AmountWithCurrencyField
              currency={currency}
              amount={calculateFundAmount(fund, totalAmount)}
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
      name="fundDistributions"
      props={{
        canAdd: !disabled,
        canRemove: !disabled,
        formValues,
      }}
      renderField={renderSubForm}
    />
  );
};

FundDistributionFields.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  formValues: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  currency: PropTypes.string,
};

FundDistributionFields.defaultProps = {
  disabled: false,
  required: true,
};

export default FundDistributionFields;
