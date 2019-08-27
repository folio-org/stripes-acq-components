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
  Select,
  TextField,
} from '@folio/stripes/components';

import { parseNumber, validateRequired } from '../utils';

const calculateAmount = (fund, formValues, estimatedPrice) => {
  const fundDistributionPercentage = fund.percentage || 0;

  return ((fundDistributionPercentage / 100) * estimatedPrice).toFixed(2);
};

const FieldsFundView = ({
  required, disabled, estimatedPrice, formValues, funds, fund, elem, fundCode,
}) => {
  return (
    <Row>
      <Col xs={4}>
        <Field
          component={Select}
          dataOptions={funds}
          fullWidth
          label={<FormattedMessage id="ui-orders.fundDistribution.id" />}
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
          label={<FormattedMessage id="ui-orders.fundDistribution.percent" />}
          name={`${elem}.percentage`}
          parse={parseNumber}
          type="number"
          required={required}
          validate={required && [validateRequired]}
          disabled={disabled}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.fundDistribution.code" />}
          value={fundCode}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.fundDistribution.amount" />}
          value={calculateAmount(fund, formValues, estimatedPrice)}
        />
      </Col>
    </Row>
  );
};

FieldsFundView.propTypes = {
  formValues: PropTypes.object.isRequired,
  estimatedPrice: PropTypes.number.isRequired,
  elem: PropTypes.string.isRequired,
  fundCode: PropTypes.string.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  fund: PropTypes.object,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldsFundView.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldsFundView;
