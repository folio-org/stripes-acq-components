import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';

import {
  validateRequired,
  calculateFundAmount,
} from '../../utils';
import { FieldSelect } from '../../FieldSelect';
import { AmountWithCurrencyField } from '../../AmountWithCurrencyField';

const FundDistributionFields = ({
  required, disabled, totalAmount, funds, fund, elem, fundCode, currency,
}) => {
  return (
    <Row>
      <Col xs={4}>
        <FieldSelect
          dataOptions={funds}
          fullWidth
          label={<FormattedMessage id="stripes-acq-components.fundDistribution.id" />}
          name={`${elem}.fundId`}
          placeholder=" "
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

FundDistributionFields.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  elem: PropTypes.string.isRequired,
  fundCode: PropTypes.string.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  fund: PropTypes.object,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  currency: PropTypes.string,
};

FundDistributionFields.defaultProps = {
  disabled: false,
  required: true,
};

export default FundDistributionFields;
