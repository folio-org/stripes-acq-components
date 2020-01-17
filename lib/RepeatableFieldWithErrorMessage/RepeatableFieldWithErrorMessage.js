import React from 'react';
import PropTypes from 'prop-types';

import { RepeatableField } from '@folio/stripes/components';

import css from './RepeatableFieldWithErrorMessage.css';

function RepeatableFieldWithErrorMessage(props) {
  const { meta: { error, submitFailed } } = props;

  return (
    <>
      {submitFailed && error && (
        <div className={css.feedbackError}>
          {error}
        </div>
      )}
      <RepeatableField {...props} />
    </>
  );
}

RepeatableFieldWithErrorMessage.propTypes = {
  meta: PropTypes.shape({
    error: PropTypes.node,
    submitFailed: PropTypes.bool,
  }),
};

export default RepeatableFieldWithErrorMessage;
