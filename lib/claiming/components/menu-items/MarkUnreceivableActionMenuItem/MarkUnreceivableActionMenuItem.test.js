/* Developed collaboratively using AI (GitHub Copilot) */

import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MarkUnreceivableActionMenuItem } from './MarkUnreceivableActionMenuItem';

const defaultProps = {
  onClick: jest.fn(),
  disabled: false,
};

const renderComponent = (props = {}) => render(
  <MarkUnreceivableActionMenuItem
    {...defaultProps}
    {...props}
  />,
);

describe('MarkUnreceivableActionMenuItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button', () => {
    renderComponent();

    expect(screen.getByTestId('unreceivable-button')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId('unreceivable-button'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should disable the button when disabled prop is true', () => {
    renderComponent({ disabled: true });

    expect(screen.getByTestId('unreceivable-button')).toBeDisabled();
  });

  it('should enable the button when disabled prop is false', () => {
    renderComponent({ disabled: false });

    expect(screen.getByTestId('unreceivable-button')).toBeEnabled();
  });
});
