import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { RepeatableField } from '@folio/stripes/components';

import css from './RepeatableFieldWithErrorMessage.css';

function RepeatableFieldWithValidation(props) {
  const { meta } = props;

  const [error, setError] = useState();

  useEffect(() => {
    Promise
      .resolve(meta.error)
      .then(setError);
  }, [meta.error]);

  return (
    <>
      {error && !Array.isArray(error) && (
        <div className={css.feedbackError}>
          {error}
        </div>
      )}
      <RepeatableField {...props} />
    </>
  );
}

RepeatableFieldWithValidation.propTypes = {
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.any),
      PropTypes.object,
    ]),
  }),
};

export default RepeatableFieldWithValidation;
