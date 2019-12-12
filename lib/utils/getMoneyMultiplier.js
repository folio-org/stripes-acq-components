export function getMoneyMultiplier(currency) {
  const numberFormat = new Intl.NumberFormat(undefined, { style: 'currency', currency });
  const maximumFractionDigits = numberFormat.resolvedOptions().maximumFractionDigits;

  return 10 ** maximumFractionDigits;
}
