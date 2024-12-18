/* Developed collaboratively using AI (GitHub Copilot) */

import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DelayClaimActionMenuItem } from './DelayClaimActionMenuItem';

const defaultProps = {
  onClick: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <DelayClaimActionMenuItem
    {...defaultProps}
    {...props}
  />,
);

describe('DelayClaimActionMenuItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call onClick when button is clicked', async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId('delay-claim-button'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    renderComponent({ disabled: true });

    expect(screen.getByTestId('delay-claim-button')).toBeDisabled();
  });

  it('should not call onClick when button is disabled and clicked', async () => {
    renderComponent({ disabled: true });

    await userEvent.click(screen.getByTestId('delay-claim-button'));

    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });
});
