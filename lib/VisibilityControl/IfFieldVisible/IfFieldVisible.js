import { ARRAY_ERROR } from 'final-form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  memo,
  useCallback,
  useState,
} from 'react';
import { FormSpy } from 'react-final-form';

import { IfVisible } from '../IfVisible';

const subscription = {
  errors: true,
};

const resolveFieldError = async (errors, name) => {
  const errorValue = await get(errors, name);

  if (!Array.isArray(errorValue)) {
    return errorValue;
  }

  return errorValue.length
    ? errorValue[0]
    : errorValue[ARRAY_ERROR];
};

const IfFieldVisible = ({
  children,
  name,
  visible = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const isVisible = visible || hasError;

  const handleChange = useCallback(({ errors }) => {
    return Promise
      .all(name?.split(',').map((fieldName) => resolveFieldError(errors, fieldName)) ?? [])
      .then((errorValues) => errorValues.some(Boolean))
      .then(setHasError);
  }, [name]);

  return (
    <>
      <IfVisible visible={isVisible}>{children}</IfVisible>
      <FormSpy
        subscription={subscription}
        onChange={handleChange}
      />
    </>
  );
};

IfFieldVisible.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  visible: PropTypes.bool,
};

export default memo(IfFieldVisible);
