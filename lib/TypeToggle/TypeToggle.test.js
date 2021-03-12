import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import TypeToggle from './TypeToggle';

const renderComponent = (props = {}) => (render(
  <TypeToggle
    label="type toggle"
    {...props}
  />,
));

describe('TypeToggle', () => {
  let input = null;

  beforeEach(() => {
    input = {
      name: 'test name',
      onChange: jest.fn(),
    };
  });

  it('should display TypeToggle', async () => {
    renderComponent({ input });
    expect(screen.getByText('type toggle')).toBeDefined();
  });

  it('should call onChange with `amount`', async () => {
    const onChangeToAmount = jest.fn();

    renderComponent({ input, onChangeToAmount });
    user.click(screen.getByText('$'));
    expect(input.onChange).toHaveBeenCalledWith('amount');
    expect(onChangeToAmount).toHaveBeenCalledWith('test name');
  });

  it('should call onChange with `percentage`', async () => {
    const onChangeToPercent = jest.fn();

    renderComponent({ input, onChangeToPercent });
    user.click(screen.getByText('stripes-acq-components.fundDistribution.type.sign.percent'));
    expect(input.onChange).toHaveBeenCalledWith('percentage');
    expect(onChangeToPercent).toHaveBeenCalledWith('test name');
  });
});
