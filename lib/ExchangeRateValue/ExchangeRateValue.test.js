import React from 'react';
import { render } from '@testing-library/react';

import { useExchangeRateValue } from '../hooks';
import ExchangeRateValue from './ExchangeRateValue';

jest.mock('../hooks', () => {
  return {
    useExchangeRateValue: jest.fn(),
  };
});

const renderExchangeRateValue = () => (render(
  <ExchangeRateValue
    exchangeFrom="EUR"
    exchangeTo="USD"
  />,
));

describe('ExchangeRateValue', () => {
  beforeEach(() => {
    useExchangeRateValue.mockClear().mockReturnValue({
      isLoading: false,
      exchangeRate: 1.2,
    });
  });

  it('should render exchange rate value', () => {
    const { getByText } = renderExchangeRateValue();

    expect(getByText('1.2')).toBeDefined();
  });
});
