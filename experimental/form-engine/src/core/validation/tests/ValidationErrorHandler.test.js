/* Developed collaboratively using AI (Cursor) */

import { ValidationErrorHandler } from '../ValidationErrorHandler';
import { ValidationErrorStrategy } from '../ValidationErrorStrategy';

describe('ValidationErrorHandler', () => {
  let handler;
  let engine;

  beforeEach(() => {
    handler = new ValidationErrorHandler();
    engine = {
      setError: jest.fn(),
      clearError: jest.fn(),
    };
  });

  describe('handle', () => {
    it('should handle null error', () => {
      handler.handle(null, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(engine.setError).not.toHaveBeenCalled();
    });

    it('should handle string error', () => {
      handler.handle('Error message', engine, '$form');

      expect(engine.setError).toHaveBeenCalledWith('$form', 'Error message');
    });

    it('should handle object error', () => {
      const error = {
        'field1': 'Error 1',
        'field2': 'Error 2',
      };

      handler.handle(error, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(engine.setError).toHaveBeenCalledWith('field1', 'Error 1', 'form');
      expect(engine.setError).toHaveBeenCalledWith('field2', 'Error 2', 'form');
    });

    it('should handle array error and log warning', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const error = [{ field: 'error' }];

      handler.handle(error, engine, '$form');

      expect(engine.clearError).toHaveBeenCalledWith('$form');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should use custom formErrorPath', () => {
      handler.handle('Error', engine, 'customPath');

      expect(engine.setError).toHaveBeenCalledWith('customPath', 'Error');
    });

    it('should fallback to string conversion for unknown type', () => {
      const error = 123;

      handler.handle(error, engine, '$form');

      expect(engine.setError).toHaveBeenCalledWith('$form', '123');
    });
  });

  describe('addStrategy', () => {
    it('should add custom strategy', () => {
      class CustomStrategy extends ValidationErrorStrategy {
        canHandle(error) {
          return error === 'custom';
        }

        handle(error, mockEngine, formErrorPath) {
          mockEngine.setError(formErrorPath, 'custom handled');
        }
      }

      const customStrategy = new CustomStrategy();

      handler.addStrategy(customStrategy, 0);

      handler.handle('custom', engine, '$form');

      expect(engine.setError).toHaveBeenCalledWith('$form', 'custom handled');
    });

    it('should respect priority order', () => {
      class HighPriorityStrategy extends ValidationErrorStrategy {
        canHandle(error) {
          return typeof error === 'string';
        }

        handle(error, mockEngine, formErrorPath) {
          mockEngine.setError(formErrorPath, 'high priority');
        }
      }

      const highPriority = new HighPriorityStrategy();

      handler.addStrategy(highPriority, 0);

      handler.handle('test', engine, '$form');

      expect(engine.setError).toHaveBeenCalledWith('$form', 'high priority');
    });

    it('should add strategy at end if no priority specified', () => {
      class LowPriorityStrategy extends ValidationErrorStrategy {
        canHandle(error) {
          return typeof error === 'number';
        }

        handle(error, mockEngine, formErrorPath) {
          mockEngine.setError(formErrorPath, 'number handled');
        }
      }

      const lowPriority = new LowPriorityStrategy();

      handler.addStrategy(lowPriority);

      // String strategy should handle regular strings first
      handler.handle('test', engine, '$form');

      expect(engine.setError).toHaveBeenCalledWith('$form', 'test');

      engine.setError.mockClear();

      // But custom strategy should handle numbers
      handler.handle(42, engine, '$form');

      expect(engine.setError).toHaveBeenCalledWith('$form', 'number handled');
    });
  });
});
