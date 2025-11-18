import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

const FormFooter = ({
  handleSubmit,
  id = 'clickable-save-title',
  isSubmitDisabled = false,
  label = <FormattedMessage id="stripes-acq-components.FormFooter.save" />,
  onCancel,
  pristine,
  submitting,
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
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.string,
  isSubmitDisabled: PropTypes.bool,
  label: PropTypes.node,
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default FormFooter;
