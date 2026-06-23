export const quote = (value, options = {}) => {
  const { quotes = '"' } = options;

  return `${quotes}${value}${quotes}`;
};
