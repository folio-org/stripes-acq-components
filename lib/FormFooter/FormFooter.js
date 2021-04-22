import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

const FormFooter = ({
  id,
  label,
  pristine,
  submitting,
  handleSubmit,
  onCancel,
  isSubmitDisabled,
}) => {
  const start = (
    <Button
      buttonStyle="default mega"
      data-test-cancel-button
      onClick={() => onCancel()}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
    </Button>
  );

  const end = (
    <Button
      buttonStyle="primary mega"
      data-test-save-button
      disabled={pristine || submitting || isSubmitDisabled}
      id={id}
      onClick={handleSubmit}
      type="submit"
    >
      {label}
    </Button>
  );

  return (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );
};

FormFooter.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitDisabled: PropTypes.bool,
};

FormFooter.defaultProps = {
  id: 'clickable-save-title',
  isSubmitDisabled: false,
  label: <FormattedMessage id="stripes-acq-components.FormFooter.save" />,
};

export default FormFooter;
