/* Developed collaboratively using AI (Cursor) */

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { FormNavigationModal } from '../FormNavigationModal';

// Mock stripes-components
jest.mock('@folio/stripes-components', () => ({
  ConfirmationModal: ({ open, onConfirm, onCancel, message, heading, confirmLabel, cancelLabel }) => (
    open ? (
      <div data-testid="modal">
        <div data-testid="message">{message}</div>
        <div data-testid="heading">{heading}</div>
        <button type="button" data-testid="confirm" onClick={onConfirm}>{confirmLabel}</button>
        <button type="button" data-testid="cancel" onClick={onCancel}>{cancelLabel}</button>
      </div>
    ) : null
  ),
}));

describe('FormNavigationModal', () => {
  it('should render modal when open', () => {
    render(
      <FormNavigationModal
        open
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('should not render modal when closed', () => {
    render(
      <FormNavigationModal
        open={false}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <FormNavigationModal
        open
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );
    await user.click(screen.getByTestId('confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <FormNavigationModal
        open
        onConfirm={jest.fn()}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByTestId('cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
