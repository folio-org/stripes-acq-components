export function getMoneyMultiplier(stripes, recordCurrency) {
  const currency = recordCurrency || stripes.currency;
  const numberFormat = new Intl.NumberFormat(stripes.locale, { style: 'currency', currency });
  const maximumFractionDigits = numberFormat.resolvedOptions().maximumFractionDigits;

  return 10 ** maximumFractionDigits;
}
