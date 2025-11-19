/* Developed collaboratively using AI (Cursor) */

import {
  handleValidationError,
  scheduleValidation,
} from '../validationErrorHandler';

describe('validationErrorHandler', () => {
  describe('handleValidationError', () => {
    let engine;

    beforeEach(() => {
      engine = {
        setError: jest.fn(),
        clearError: jest.fn(),
      };
    });

    it('should clear error when error is null', () => {
      handleValidationError(null, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(engine.setError).not.toHaveBeenCalled();
    });

    it('should clear error when error is undefined', () => {
      handleValidationError(undefined, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(engine.setError).not.toHaveBeenCalled();
    });

    it('should set form-level error when error is a string', () => {
      handleValidationError('Form error message', engine, '$form');

      expect(engine.setError).toHaveBeenCalledWith('$form', 'Form error message');
      expect(engine.clearError).not.toHaveBeenCalled();
    });

    it('should handle object error with field-level errors', () => {
      const error = {
        'user.name': 'Name is required',
        'user.email': 'Invalid email',
      };

      handleValidationError(error, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(engine.setError).toHaveBeenCalledWith('user.name', 'Name is required', 'form');
      expect(engine.setError).toHaveBeenCalledWith('user.email', 'Invalid email', 'form');
    });

    it('should clear field errors when field error is null', () => {
      const error = {
        'user.name': 'Name is required',
        'user.email': null,
      };

      handleValidationError(error, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(engine.setError).toHaveBeenCalledWith('user.name', 'Name is required', 'form');
      expect(engine.clearError).toHaveBeenCalledWith('user.email', 'form');
    });

    it('should handle array error and log warning', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const error = [
        { field1: 'error1' },
        { field2: 'error2' },
      ];

      handleValidationError(error, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Form validator returned array structure'),
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle empty object error', () => {
      handleValidationError({}, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(engine.setError).not.toHaveBeenCalled();
    });

    it('should handle empty array error', () => {
      handleValidationError([], engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
    });

    it('should use custom formErrorPath', () => {
      handleValidationError('Error', engine, 'customPath');

      expect(engine.setError).toHaveBeenCalledWith('customPath', 'Error');
    });
  });

  describe('scheduleValidation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should use requestAnimationFrame for change mode', () => {
      const mockFn = jest.fn();
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');

      scheduleValidation(mockFn, 'change');

      expect(rafSpy).toHaveBeenCalledWith(mockFn);

      rafSpy.mockRestore();
    });

    it('should use queueMicrotask for blur mode', () => {
      const mockFn = jest.fn();
      const queueMicrotaskSpy = jest.spyOn(global, 'queueMicrotask');

      scheduleValidation(mockFn, 'blur');

      expect(queueMicrotaskSpy).toHaveBeenCalledWith(mockFn);

      queueMicrotaskSpy.mockRestore();
    });

    it('should execute immediately for submit mode', () => {
      const mockFn = jest.fn();

      scheduleValidation(mockFn, 'submit');

      expect(mockFn).toHaveBeenCalled();
    });

    it('should execute immediately for unknown mode', () => {
      const mockFn = jest.fn();

      scheduleValidation(mockFn, 'unknown');

      expect(mockFn).toHaveBeenCalled();
    });

    it('should fallback to setTimeout when requestAnimationFrame is not available', () => {
      const mockFn = jest.fn();
      const originalRAF = global.requestAnimationFrame;

      global.requestAnimationFrame = undefined;

      scheduleValidation(mockFn, 'change');

      jest.runAllTimers();

      expect(mockFn).toHaveBeenCalled();

      global.requestAnimationFrame = originalRAF;
    });

    it('should fallback to Promise when queueMicrotask is not available', async () => {
      const mockFn = jest.fn();
      const originalQueueMicrotask = global.queueMicrotask;

      global.queueMicrotask = undefined;

      scheduleValidation(mockFn, 'blur');

      await Promise.resolve();

      expect(mockFn).toHaveBeenCalled();

      global.queueMicrotask = originalQueueMicrotask;
    });
  });
});
