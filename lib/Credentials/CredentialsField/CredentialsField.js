import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Field } from 'react-final-form';

import { KeyValue } from '@folio/stripes/components';

import { TextField } from '../../Fields';
import { CredentialsContext } from '../CredentialsContext';

const MASKED_VALUE = '********';

export const CredentialsField = ({
  disabled,
  value,
  ...props
}) => {
  const {
    isCredentialsVisible,
    isKeyValue,
    isPermitted,
  } = useContext(CredentialsContext);

  const isVisible = isCredentialsVisible && isPermitted;
  const isDisabled = !isPermitted || disabled;
  const fieldType = isVisible ? 'text' : 'password';
  const keyValueString = isVisible ? (props.children ?? value) : MASKED_VALUE;

  return (
    <>
      {
        isKeyValue
          ? (
            <KeyValue
              {...props}
            >
              {keyValueString}
            </KeyValue>
          )
          : (
            <Field
              data-testid="credentials-field"
              component={TextField}
              type={fieldType}
              fullWidth
              value={value}
              {...props}
              disabled={isDisabled}
            />
          )
      }
    </>
  );
};

CredentialsField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  disabled: PropTypes.bool,
  value: PropTypes.string,
};
