/* Developed collaboratively using AI (Cursor) */

import { VALIDATION_MODES } from '../../../constants';
import {
  buildOnBlurCommands,
  buildOnChangeCommands,
} from '../fieldHandlers';

describe('fieldHandlers', () => {
  it('should build onChange commands', () => {
    const engine = {
      set: jest.fn(),
      hasValidator: jest.fn(() => false),
      registerValidator: jest.fn(),
      getValues: jest.fn(() => ({})),
    };
    const commands = buildOnChangeCommands({
      engine,
      name: 'email',
      validate: jest.fn(),
      validateOn: VALIDATION_MODES.CHANGE,
      debouncedValidate: jest.fn(),
      newValue: 'test@test.com',
    });

    expect(commands.length).toBe(3);
    commands.forEach(cmd => cmd());
    expect(engine.set).toHaveBeenCalledWith('email', 'test@test.com');
  });

  it('should build onBlur commands', () => {
    const engine = {
      touch: jest.fn(),
      blur: jest.fn(),
      getErrors: jest.fn(() => ({})),
      clearError: jest.fn(),
      get: jest.fn(() => 'test'),
      getValues: jest.fn(() => ({})),
      validationService: {
        validateByMode: jest.fn(() => Promise.resolve(null)),
      },
    };
    const commands = buildOnBlurCommands({
      engine,
      name: 'email',
      validate: jest.fn(),
      validateOn: VALIDATION_MODES.BLUR,
    });

    expect(commands.length).toBe(4);
    commands.forEach(cmd => cmd());
    expect(engine.touch).toHaveBeenCalledWith('email');
    expect(engine.blur).toHaveBeenCalled();
  });

  it('should clear error on blur for submit validation mode', () => {
    const engine = {
      touch: jest.fn(),
      blur: jest.fn(),
      getErrors: jest.fn(() => ({ email: 'Error' })),
      clearError: jest.fn(),
      get: jest.fn(() => 'test'),
      getValues: jest.fn(() => ({})),
      validationService: {
        validateByMode: jest.fn(() => Promise.resolve(null)),
      },
    };
    const commands = buildOnBlurCommands({
      engine,
      name: 'email',
      validate: jest.fn(),
      validateOn: VALIDATION_MODES.SUBMIT,
    });

    commands.forEach(cmd => cmd());
    expect(engine.clearError).toHaveBeenCalledWith('email');
  });
});
