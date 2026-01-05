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

    expect(commands.length).toBe(3);
    commands.forEach(cmd => cmd());
    expect(engine.touch).toHaveBeenCalledWith('email');
    expect(engine.blur).toHaveBeenCalled();
  });

  it('should not validate on blur for submit mode - errors persist until explicit validation', () => {
    const engine = {
      touch: jest.fn(),
      blur: jest.fn(),
      getErrors: jest.fn(() => ({ email: 'Error from validate' })),
      clearError: jest.fn(),
      setError: jest.fn(),
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

    for (const cmd of commands) cmd();

    // Validation should NOT happen on blur for SUBMIT mode
    expect(engine.validationService.validateByMode).not.toHaveBeenCalled();
    // Errors should NOT be cleared or changed on blur
    expect(engine.clearError).not.toHaveBeenCalled();
    expect(engine.setError).not.toHaveBeenCalled();
  });
});
