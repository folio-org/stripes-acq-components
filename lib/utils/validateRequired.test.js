import {
  validateNoSpaces,
  validatePositiveAmount,
  validateRequired,
  validateRequiredMaxNumber,
  validateRequiredMinNumber,
  validateRequiredNotNegative,
  validateRequiredNumber,
  validateRequiredPositiveAmount,
} from './validateRequired';

describe('validateRequired', () => {
  it('validateNoSpaces', () => {
    expect(validateNoSpaces('some code')).toBeTruthy();
    expect(validateNoSpaces('some_code')).toBe(undefined);
  });

  it('validateRequired', () => {
    expect(validateRequired('')).toBeTruthy();
    expect(validateRequired(null)).toBeTruthy();
    expect(validateRequired(undefined)).toBeTruthy();
    expect(validateRequired('some value')).toBe(undefined);
  });

  it('validateRequiredNotNegative', () => {
    expect(validateRequiredNotNegative('')).toBeTruthy();
    expect(validateRequiredNotNegative(null)).toBeTruthy();
    expect(validateRequiredNotNegative(undefined)).toBeTruthy();
    expect(validateRequiredNotNegative(-1)).toBeTruthy();
    expect(validateRequiredNotNegative(0)).toBe(undefined);
    expect(validateRequiredNotNegative('0')).toBe(undefined);
    expect(validateRequiredNotNegative(1)).toBe(undefined);
    expect(validateRequiredNotNegative('some value')).toBeTruthy();
  });

  it('validateRequiredNumber', () => {
    expect(validateRequiredNumber('')).toBeTruthy();
    expect(validateRequiredNumber(null)).toBeTruthy();
    expect(validateRequiredNumber(undefined)).toBeTruthy();
    expect(validateRequiredNumber(-1)).toBe(undefined);
    expect(validateRequiredNumber(0)).toBe(undefined);
    expect(validateRequiredNumber(1)).toBe(undefined);
    expect(validateRequiredNumber('some value')).toBeTruthy();
  });

  it('validateRequiredPositiveAmount', () => {
    expect(validateRequiredPositiveAmount('')).toBeTruthy();
    expect(validateRequiredPositiveAmount(null)).toBeTruthy();
    expect(validateRequiredPositiveAmount(undefined)).toBeTruthy();
    expect(validateRequiredPositiveAmount(-1)).toBeTruthy();
    expect(validateRequiredPositiveAmount(0)).toBeTruthy();
    expect(validateRequiredPositiveAmount(0.1)).toBe(undefined);
    expect(validateRequiredPositiveAmount(1)).toBe(undefined);
    expect(validateRequiredPositiveAmount('some value')).toBeTruthy();
  });

  it('validateRequiredMinNumber', () => {
    expect(validateRequiredMinNumber({ minNumber: 1, value: 0 })).toBeTruthy();
    expect(validateRequiredMinNumber({ minNumber: 1, value: 1 })).toBe(undefined);
    expect(validateRequiredMinNumber({ minNumber: 1, value: 2 })).toBe(undefined);
  });

  it('validateRequiredMaxNumber', () => {
    expect(validateRequiredMaxNumber({ maxNumber: 1, value: 0 })).toBe(undefined);
    expect(validateRequiredMaxNumber({ maxNumber: 1, value: 1 })).toBe(undefined);
    expect(validateRequiredMaxNumber({ maxNumber: 1, value: 2 })).toBeTruthy();
  });

  it('validatePositiveAmount', () => {
    expect(validatePositiveAmount('')).toBe(undefined);
    expect(validatePositiveAmount(null)).toBe(undefined);
    expect(validatePositiveAmount(undefined)).toBe(undefined);
    expect(validatePositiveAmount(-1)).toBeTruthy();
    expect(validatePositiveAmount(0)).toBeTruthy();
  });
});
