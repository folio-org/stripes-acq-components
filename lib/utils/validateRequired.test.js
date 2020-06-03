import {
  validateNoSpaces,
  validateRequired,
  validateRequiredNotNegative,
  validateRequiredNumber,
} from './validateRequired';

test('validateNoSpaces', () => {
  expect(validateNoSpaces('some code')).toBeTruthy();
  expect(validateNoSpaces('some_code')).toBe(undefined);
});

test('validateRequired', () => {
  expect(validateRequired('')).toBeTruthy();
  expect(validateRequired(null)).toBeTruthy();
  expect(validateRequired(undefined)).toBeTruthy();
  expect(validateRequired('some value')).toBe(undefined);
});

test('validateRequiredNotNegative', () => {
  expect(validateRequiredNotNegative('')).toBeTruthy();
  expect(validateRequiredNotNegative(null)).toBeTruthy();
  expect(validateRequiredNotNegative(undefined)).toBeTruthy();
  expect(validateRequiredNotNegative(-1)).toBeTruthy();
  expect(validateRequiredNotNegative(0)).toBe(undefined);
  expect(validateRequiredNotNegative(1)).toBe(undefined);
  expect(validateRequiredNotNegative('some value')).toBeTruthy();
});

test('validateRequiredNumber', () => {
  expect(validateRequiredNumber('')).toBeTruthy();
  expect(validateRequiredNumber(null)).toBeTruthy();
  expect(validateRequiredNumber(undefined)).toBeTruthy();
  expect(validateRequiredNumber(-1)).toBe(undefined);
  expect(validateRequiredNumber(0)).toBe(undefined);
  expect(validateRequiredNumber(1)).toBe(undefined);
  expect(validateRequiredNumber('some value')).toBeTruthy();
});
