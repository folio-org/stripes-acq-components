import React from 'react';
import { render, screen } from '@testing-library/react';

import CurrencyValue from './CurrencyValue';

const renderComponent = (props = {}) => (render(
  <CurrencyValue
    {...props}
  />,
));

describe('CurrencyValue', () => {
  it('should display passed currency', () => {
    renderComponent({ value: 'EUR' });
    expect(screen.getByText('EUR')).toBeDefined();
  });
});
