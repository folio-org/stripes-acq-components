// eslint-disable-next-line import/prefer-default-export
export function parseNumber(value) {
  return value && value.length > 0 ? Number(value) : value;
}
