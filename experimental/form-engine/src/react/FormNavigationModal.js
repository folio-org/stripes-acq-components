/**
 * FormNavigationModal - Ready-to-use confirmation modal for navigation guard
 */

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export function FormNavigationModal({
  open,
  message = <FormattedMessage id="stripes-form.unsavedChanges" />,
  heading = <FormattedMessage id="stripes-form.areYouSure" />,
  confirmLabel = <FormattedMessage id="stripes-form.keepEditing" />,
  cancelLabel = <FormattedMessage id="stripes-form.closeWithoutSaving" />,
  onConfirm,
  onCancel,
}) {
  return (
    <ConfirmationModal
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      heading={heading}
      id="form-engine-navigation-guard-confirmation"
      message={message}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
    />
  );
}

FormNavigationModal.propTypes = {
  cancelLabel: PropTypes.node,
  confirmLabel: PropTypes.node,
  heading: PropTypes.node,
  message: PropTypes.node,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
