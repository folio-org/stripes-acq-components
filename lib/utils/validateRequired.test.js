import {
  validateNoSpaces,
  validateRequired,
  validateRequiredMaxNumber,
  validateRequiredMinNumber,
  validateRequiredNotNegative,
  validateRequiredNumber,
  validateRequiredPositiveAmount,
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
  expect(validateRequiredNotNegative('0')).toBe(undefined);
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

test('validateRequiredPositiveAmount', () => {
  expect(validateRequiredPositiveAmount('')).toBeTruthy();
  expect(validateRequiredPositiveAmount(null)).toBeTruthy();
  expect(validateRequiredPositiveAmount(undefined)).toBeTruthy();
  expect(validateRequiredPositiveAmount(-1)).toBeTruthy();
  expect(validateRequiredPositiveAmount(0)).toBeTruthy();
  expect(validateRequiredPositiveAmount(0.1)).toBe(undefined);
  expect(validateRequiredPositiveAmount(1)).toBe(undefined);
  expect(validateRequiredPositiveAmount('some value')).toBeTruthy();
});

test('validateRequiredMinNumber', () => {
  expect(validateRequiredMinNumber({ minNumber: 1, value: 0 })).toBeTruthy();
  expect(validateRequiredMinNumber({ minNumber: 1, value: 1 })).toBe(undefined);
  expect(validateRequiredMinNumber({ minNumber: 1, value: 2 })).toBe(undefined);
});

test('validateRequiredMaxNumber', () => {
  expect(validateRequiredMaxNumber({ maxNumber: 1, value: 0 })).toBe(undefined);
  expect(validateRequiredMaxNumber({ maxNumber: 1, value: 1 })).toBe(undefined);
  expect(validateRequiredMaxNumber({ maxNumber: 1, value: 2 })).toBeTruthy();
});
