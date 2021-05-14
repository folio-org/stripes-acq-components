import React from 'react';
import PropTypes from 'prop-types';

import { KeyboardShortcutsModal } from '@folio/stripes/components';

import { acqCommands } from '../constants';

const AcqKeyboardShortcutsModal = ({
  commands = [],
  onClose,
}) => (
  <KeyboardShortcutsModal
    open
    onClose={onClose}
    allCommands={[...acqCommands, ...commands]}
  />
);

AcqKeyboardShortcutsModal.propTypes = {
  commands: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
};

export default AcqKeyboardShortcutsModal;
