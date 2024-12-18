/* Developed collaboratively using AI (GitHub Copilot) */

import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SendClaimActionMenuItem } from './SendClaimActionMenuItem';

const defaultProps = {
  onClick: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <SendClaimActionMenuItem
    {...defaultProps}
    {...props}
  />,
);

describe('SendClaimActionMenuItem', () => {
  it('should render the button', () => {
    renderComponent();

    expect(screen.getByTestId('send-claim-button')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId('send-claim-button'));

    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('should disable the button when disabled prop is true', () => {
    renderComponent({ disabled: true });

    expect(screen.getByTestId('send-claim-button')).toBeDisabled();
  });

  it('should enable the button when disabled prop is false', () => {
    renderComponent({ disabled: false });

    expect(screen.getByTestId('send-claim-button')).not.toBeDisabled();
  });
});
