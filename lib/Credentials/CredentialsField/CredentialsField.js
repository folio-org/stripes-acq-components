import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Field,
  useForm,
} from 'react-final-form';

import { KeyValue } from '@folio/stripes/components';

import { TextField } from '../../Fields';
import { CredentialsContext } from '../CredentialsContext';

const MASKED_VALUE = '********';

export const CredentialsField = ({
  disabled,
  isNonInteractive = false,
  name,
  value,
  ...props
}) => {
  const {
    isCredentialsVisible,
    isKeyValue,
    isPermitted,
  } = useContext(CredentialsContext);

  const { getState } = useForm();

  const isDisclosed = isCredentialsVisible && isPermitted;
  const displayAsKeyValue = isKeyValue || isNonInteractive || !isPermitted;

  return (
    <>
      {
        displayAsKeyValue
          ? (
            <KeyValue {...props}>
              {(
                isDisclosed
                  ? (props.children ?? value ?? getState()?.values?.[name])
                  : MASKED_VALUE
              )}
            </KeyValue>
          )
          : (
            <Field
              data-testid="credentials-field"
              component={TextField}
              name={name}
              type={isDisclosed ? 'text' : 'password'}
              fullWidth
              value={value}
              {...props}
              disabled={disabled}
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
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};
