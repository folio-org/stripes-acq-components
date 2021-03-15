import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import ResetButton from './ResetButton';

const renderResetButton = (props = {}) => (render(
  <ResetButton
    {...props}
  />,
));

describe('ResetButton', () => {
  it('should call reset prop when button is pressed', () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset });

    user.click(getByTestId('reset-button'));

    expect(reset).toHaveBeenCalled();
  });

  it('should be disabled when prop is truthy', () => {
    const reset = jest.fn();
    const { getByTestId } = renderResetButton({ reset, disabled: true });

    expect(getByTestId('reset-button').disabled).toBeTruthy();
  });
});
