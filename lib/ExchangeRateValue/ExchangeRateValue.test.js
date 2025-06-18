import { render } from '@folio/jest-config-stripes/testing-library/react';

import { useExchangeRateValue } from '../hooks';
import ExchangeRateValue from './ExchangeRateValue';

jest.mock('../hooks', () => ({
  useExchangeRateValue: jest.fn(),
}));

const renderExchangeRateValue = () => render(
  <ExchangeRateValue
    exchangeFrom="EUR"
    exchangeTo="USD"
  />,
);

describe('ExchangeRateValue', () => {
  beforeEach(() => {
    useExchangeRateValue.mockReturnValue({
      isLoading: false,
      exchangeRate: 1.2,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render exchange rate value', () => {
    const { getByText } = renderExchangeRateValue();

    expect(getByText('1.2')).toBeInTheDocument();
  });
});
