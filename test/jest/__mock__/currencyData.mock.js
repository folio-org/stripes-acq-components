jest.mock('currency-codes/data', () => ({
  filter: () => [
    {
      code: 'USD',
      countries: [],
      currency: 'US Dollar',
      digits: 2,
      number: '840',
    },
  ],
}));
