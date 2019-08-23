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
  RepeatableField,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { parseNumber, validateRequired } from '../utils';

const calculateAmount = (fund, formValues, estimatedPrice) => {
  const fundDistributionPercentage = fund.percentage || 0;

  return ((fundDistributionPercentage / 100) * estimatedPrice).toFixed(2);
};

const FieldsFundDistribution = ({ funds, estimatedPrice, disabled, required, formValues }) => {
  const renderSubForm = (elem, index, fields) => {
    const fund = fields.get(index);
    const fundCode = get(funds.find(({ value }) => value === fund.fundId), 'code');

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

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-orders.fundDistribution.addBtn" />}
      component={RepeatableField}
      name="fundDistribution"
      props={{
        canAdd: !disabled,
        canRemove: !disabled,
        formValues,
      }}
      renderField={renderSubForm}
    />
  );
};

FieldsFundDistribution.propTypes = {
  funds: PropTypes.arrayOf(PropTypes.object),
  formValues: PropTypes.object.isRequired,
  estimatedPrice: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldsFundDistribution.defaultProps = {
  funds: [],
  disabled: false,
  required: true,
};

export default FieldsFundDistribution;
