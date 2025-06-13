import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import AmountWithCurrencyField from './AmountWithCurrencyField';

const renderAmountWithCurrencyField = (props = {}) => (render(
  <AmountWithCurrencyField
    {...props}
  />,
));

describe('AmountWithCurrencyField', () => {
  it('should display NoValue component', () => {
    renderAmountWithCurrencyField();

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should display negative amount as is', () => {
    renderAmountWithCurrencyField({ amount: -23.34 });

    expect(screen.getByText('-$23.34')).toBeInTheDocument();
  });

  it('should display negative amount with brackets', () => {
    renderAmountWithCurrencyField({ amount: -23.34, showBrackets: true });

    expect(screen.getByText('($23.34)')).toBeInTheDocument();
  });

  it('should display amount in custom currency', () => {
    renderAmountWithCurrencyField({ amount: 23.34, currency: 'EUR' });

    expect(screen.getByText('€23.34')).toBeInTheDocument();
  });
});
