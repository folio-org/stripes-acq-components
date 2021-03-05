import React from 'react';
import { render, screen } from '@testing-library/react';

import CurrencySymbol from './CurrencySymbol';

const renderComponent = (props = {}) => (render(
  <CurrencySymbol
    {...props}
  />,
));

describe('CurrencySymbol', () => {
  it('should display passed currency', () => {
    renderComponent({ currency: 'EUR' });
    expect(screen.getByText('€')).toBeDefined();
  });

  it('should display a dash if wrong currency value is passed', () => {
    renderComponent({ currency: 'CUX+2+3[2]' });
    expect(screen.getByText('-')).toBeDefined();
  });
});
