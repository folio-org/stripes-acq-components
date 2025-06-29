import { IntlProvider } from 'react-intl';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import CurrentExchangeRate from './CurrentExchangeRate';

const renderCurrentExchangeRate = (
  exchangeFrom,
  exchangeTo,
  mutator,
) => (render(
  <IntlProvider locale="en">
    <CurrentExchangeRate
      label={<div>Label</div>}
      exchangeFrom={exchangeFrom}
      exchangeTo={exchangeTo}
      mutator={mutator}
      setExchangeRateRequired={jest.fn}
      setExchangeRateEnabled={jest.fn}
    />
  </IntlProvider>,
));

describe('CurrentExchangeRate component', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      exchangeRate: {
        GET: jest.fn(),
      },
    };
  });

  it('should display hyphen', () => {
    renderCurrentExchangeRate('USD', 'USD', mutator);
    const currentExchangeRateValue = screen.getByTestId('current-exchange-rate').querySelector('[data-test-kv-value]');

    expect(mutator.exchangeRate.GET).not.toHaveBeenCalled();
    expect(currentExchangeRateValue).toHaveTextContent('-');
  });

  it('should display loaded current exchange rate', async () => {
    let getByText;
    const exchangeRate = { exchangeRate: '1.1' };

    mutator.exchangeRate.GET.mockReturnValue(Promise.resolve(exchangeRate));

    await act(async () => {
      getByText = renderCurrentExchangeRate('USD', 'EUR', mutator).getByText;
    });

    expect(mutator.exchangeRate.GET).toHaveBeenCalled();
    expect(getByText(exchangeRate.exchangeRate)).toBeInTheDocument();
  });

  it('should display hyphen since request is rejected', async () => {
    let getByText;

    mutator.exchangeRate.GET.mockReturnValue(Promise.reject());

    await act(async () => {
      getByText = renderCurrentExchangeRate('USD', 'EUR', mutator).getByText;
    });

    expect(mutator.exchangeRate.GET).toHaveBeenCalled();
    expect(getByText('-')).toBeInTheDocument();
  });
});
