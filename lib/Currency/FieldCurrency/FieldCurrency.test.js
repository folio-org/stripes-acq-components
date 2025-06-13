import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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

  it('should call onChange', async () => {
    const onChange = jest.fn();

    renderComponent({ onChange });

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText('USD (USD)'));

    expect(onChange).toHaveBeenCalled();
  });
});
