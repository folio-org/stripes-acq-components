import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
  RepeatableField,
} from '@folio/stripes/components';

import { FieldSelectFinal } from '../../FieldSelect';
import { TextField } from '../../Fields';
import { REF_NUMBER_TYPE_OPTIONS } from '../../constants';
import { validateRequired } from '../../utils';

const parseRefNumberValue = (value) => (value === '' ? null : value);

const VendorReferenceNumbersFields = ({
  fieldName,
  withValidation,
}) => {
  const validate = withValidation ? validateRequired : undefined;

  return (
    <FieldArray
      addLabel={<FormattedMessage id="stripes-acq-components.referenceNumbers.addReferenceNumbers" />}
      component={RepeatableField}
      name={fieldName}
      renderField={field => (
        <Row>
          <Col xs>
            <Field
              component={TextField}
              data-testid={`${field}.refNumber`}
              fullWidth
              label={<FormattedMessage id="stripes-acq-components.referenceNumbers.refNumber" />}
              name={`${field}.refNumber`}
              required={withValidation}
              validate={validate}
            />
          </Col>
          <Col xs>
            <FieldSelectFinal
              dataOptions={REF_NUMBER_TYPE_OPTIONS}
              data-testid={`${field}.refNumberType`}
              fullWidth
              label={<FormattedMessage id="stripes-acq-components.referenceNumbers.refNumberType" />}
              name={`${field}.refNumberType`}
              required={withValidation}
              parse={parseRefNumberValue}
              validate={validate}
            />
          </Col>
        </Row>
      )}
    />
  );
};

VendorReferenceNumbersFields.propTypes = {
  fieldName: PropTypes.string,
  withValidation: PropTypes.bool,
};

VendorReferenceNumbersFields.defaultProps = {
  fieldName: 'referenceNumbers',
  withValidation: true,
};

export default VendorReferenceNumbersFields;
