import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import ResetButton from './ResetButton';

const renderResetButton = (props = {}) => (render(
  <ResetButton
    {...props}
  />,
));

describe('ResetButton', () => {
  it('should call reset prop when button is pressed', async () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset });

    await userEvent.click(getByTestId('reset-button'));

    expect(reset).toHaveBeenCalled();
  });

  it('should be disabled when prop is truthy', () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset, disabled: true });

    expect(getByTestId('reset-button').disabled).toBeTruthy();
  });
});
