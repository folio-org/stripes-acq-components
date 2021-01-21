export const formatDate = (value, intl) => (
  value
    ? intl.formatDate(value, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    : null
);
