/**
 * FormNavigationModal - Ready-to-use confirmation modal for navigation guard
 */

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes-components';

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
      id="formwire-navigation-guard-confirmation"
      open={open}
      message={message}
      heading={heading}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
    />
  );
}

FormNavigationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.node,
  heading: PropTypes.node,
  confirmLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


