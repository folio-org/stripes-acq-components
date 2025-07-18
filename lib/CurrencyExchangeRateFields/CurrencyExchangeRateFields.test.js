import { MemoryRouter } from 'react-router-dom';

import {
  act,
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

const onSubmit = jest.fn();

const Form = stripesFinalForm({})(({ children, handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>);

const renderComponent = ({ ...props } = {}, formProps = {}) => render(
  <MemoryRouter>
    <Form
      onSubmit={onSubmit}
      initialValues={{ currency: 'USD' }}
      {...formProps}
    >
      <CurrencyExchangeRateFields {...props} />
      <Button type="submit">Save</Button>
    </Form>
  </MemoryRouter>,
);

describe('CurrencyExchangeRateFields', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display validation messages', async () => {
    renderComponent();

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText('BYN (BYN)'));
    await userEvent.click(screen.getByTestId('use-set-exchange-rate'));

    await waitFor(() => expect(screen.getByTestId('use-set-exchange-rate')).toBeChecked());

    await act(async () => {
      CurrentExchangeRate.mock.calls[0][0].setExchangeRateRequired(true);
    });

    await userEvent.type(screen.getByTestId('exchange-rate'), '-1');
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(screen.getByText('stripes-acq-components.validation.shouldBePositiveAmount')).toBeInTheDocument());
  });

  it('should pass user input to API', async () => {
    renderComponent();

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

  it('should handle custom onChange for currency selection field', async () => {
    const onChangeCurrency = jest.fn();

    renderComponent({ onChangeCurrency });

    await act(async () => userEvent.click(screen.getByText('stripes-components.selection.controlLabel')));
    await act(async () => userEvent.click(screen.getByText('BYN (BYN)')));

    expect(onChangeCurrency).toHaveBeenCalled();
  });
});
