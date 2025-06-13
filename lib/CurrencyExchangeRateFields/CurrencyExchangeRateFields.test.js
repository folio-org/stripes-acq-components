import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Button } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import CurrentExchangeRate from './CurrentExchangeRate';
import CurrencyExchangeRateFields from './CurrencyExchangeRateFields';

jest.mock('./CurrentExchangeRate', () => {
  return jest.fn(() => 'CurrentExchangeRate');
});

// eslint-disable-next-line react/prop-types
const renderForm = ({ handleSubmit }) => (
  <form>
    <CurrencyExchangeRateFields />
    <Button onClick={handleSubmit}>
      Save
    </Button>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} initialValues={{}} {...props} />
  </MemoryRouter>,
);

describe('CurrencyExchangeRateFields', () => {
  it('should display validation messages', async () => {
    const onSubmit = jest.fn();

    renderComponent({ onSubmit });

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText('BYN (BYN)'));
    await userEvent.click(screen.getByTestId('use-set-exchange-rate'));

    await waitFor(() => expect(screen.getByTestId('use-set-exchange-rate')).toBeChecked());

    CurrentExchangeRate.mock.calls[0][0].setExchangeRateRequired(true);
    await userEvent.type(screen.getByTestId('exchange-rate'), '-1');
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(screen.getByText('stripes-acq-components.validation.shouldBePositiveAmount')).toBeInTheDocument());
  });

  it('should pass user input to API', async () => {
    const onSubmit = jest.fn();

    renderComponent({ onSubmit });

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText('BYN (BYN)'));
    await userEvent.click(screen.getByTestId('use-set-exchange-rate'));
    await userEvent.type(screen.getByTestId('exchange-rate'), '2.66');
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(onSubmit.mock.calls[0][0]).toEqual({
      currency: 'BYN',
      exchangeRate: '2.66',
    }));
  });
});
