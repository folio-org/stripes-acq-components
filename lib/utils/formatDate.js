export const formatDate = (value, intl) => (
  value
    ? intl.formatDate(value, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    : null
);
