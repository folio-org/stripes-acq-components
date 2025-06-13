import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import AcqKeyboardShortcutsModal from './AcqKeyboardShortcutsModal';

const commands = [{
  name: 'test',
  label: 'test command',
  shortcut: 'q+w',
}];

const renderAcqKeyboardShortcutsModal = (props = {}) => (render(
  <AcqKeyboardShortcutsModal
    {...props}
  />,
));

describe('AcqKeyboardShortcutsModal', () => {
  it('should display modal title', () => {
    renderAcqKeyboardShortcutsModal({ onClose: jest.fn() });
    expect(screen.getByText('stripes-components.shortcut.modalLabel')).toBeInTheDocument();
  });

  it('should display passed command title', () => {
    renderAcqKeyboardShortcutsModal({ commands, onClose: jest.fn() });
    expect(screen.getByText(commands[0].label)).toBeInTheDocument();
  });
});
