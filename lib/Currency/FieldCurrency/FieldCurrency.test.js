import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import FieldCurrency from './FieldCurrency';

// eslint-disable-next-line react/prop-types
const renderForm = ({ isNonInteractive, onChange, value }) => (
  <form>
    <FieldCurrency
      id="field-currency"
      name="field-currency"
      isNonInteractive={isNonInteractive}
      onChange={onChange}
      value={value}
    />
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} {...props} />
  </MemoryRouter>,
));

describe('FieldCurrency', () => {
  it('should display CurrencyValue if non-interactive', () => {
    renderComponent({ isNonInteractive: true, value: 'EUR' });
    expect(screen.getByText('EUR')).toBeDefined();
  });

  it('should display FieldCurrency', () => {
    renderComponent();
    expect(screen.getByText('stripes-acq-components.currency')).toBeDefined();
  });

  it('should call onChange', () => {
    const onChange = jest.fn();

    renderComponent({ onChange });
    user.click(screen.getByText('USD (USD)'));
    expect(onChange).toHaveBeenCalled();
  });
});
