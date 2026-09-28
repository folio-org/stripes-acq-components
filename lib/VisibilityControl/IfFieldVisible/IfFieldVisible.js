import { ARRAY_ERROR } from 'final-form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormSpy } from 'react-final-form';

import { IfVisible } from '../IfVisible';

const subscription = {
  errors: true,
};

const resolveFieldError = async (errors, name) => {
  const errorValue = get(errors, name);

  if (!Array.isArray(errorValue)) {
    return Boolean(await errorValue);
  }

  const [
    arrayError,
    ...itemErrors
  ] = await Promise.all([
    errorValue[ARRAY_ERROR],
    ...errorValue,
  ]);

  return itemErrors.some(Boolean) || Boolean(arrayError);
};

const IfFieldVisible = ({
  children,
  name,
  visible = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const changeIdRef = useRef(0);
  const isVisible = visible || hasError;

  const handleChange = useCallback(({ errors }) => {
    const changeId = ++changeIdRef.current;
    const fieldNames = name
      ?.split(',')
      .map((fieldName) => fieldName.trim())
      .filter(Boolean) ?? [];

    return Promise
      .all(fieldNames.map((fieldName) => resolveFieldError(errors, fieldName)))
      .then((errorValues) => errorValues.some(Boolean))
      .then((nextHasError) => {
        // Ignore results from an older form-state snapshot. Async field-array
        // validations can resolve in a different order than they were started.
        if (changeId === changeIdRef.current) {
          setHasError(nextHasError);
        }
      })
      // A rejected validation is not a usable form-state snapshot. Preserve the
      // last settled visibility until Final Form publishes another result.
      .catch(() => undefined);
  }, [name]);

  useEffect(() => () => {
    // Prevent an outstanding validation from updating state after unmount.
    changeIdRef.current += 1;
  }, []);

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
