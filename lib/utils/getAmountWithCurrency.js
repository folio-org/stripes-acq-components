// eslint-disable-next-line import/prefer-default-export
export const getAmountWithCurrency = (locale, currency, amount = 0) => (
  Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
);
