export const formatDateTime = (value, intl) => (
  value
    ? intl.formatDate(value, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
    : null
);
