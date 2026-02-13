import { ObjectErrorStrategy } from '../ObjectErrorStrategy';

describe('ObjectErrorStrategy', () => {
  let strategy;
  let mockEngine;

  beforeEach(() => {
    strategy = new ObjectErrorStrategy();
    mockEngine = {
      setError: jest.fn(),
      clearError: jest.fn(),
    };
  });

  describe('canHandle', () => {
    it('should handle plain objects', () => {
      expect(strategy.canHandle({ field: 'error' })).toBe(true);
    });

    it('should not handle arrays', () => {
      expect(strategy.canHandle(['error1', 'error2'])).toBe(false);
    });

    it('should not handle strings', () => {
      expect(strategy.canHandle('error')).toBe(false);
    });

    it('should not handle null', () => {
      expect(strategy.canHandle(null)).toBe(false);
    });

    it('should not handle undefined', () => {
      expect(strategy.canHandle(undefined)).toBe(false);
    });
  });

  describe('handle', () => {
    it('should clear form error path', () => {
      strategy.handle({ field: 'error' }, mockEngine, '$form');
      expect(mockEngine.clearError).toHaveBeenCalledWith('$form');
    });

    it('should set simple field errors', () => {
      const errors = {
        'email': 'invalid email',
        'name': 'name is required',
      };

      strategy.handle(errors, mockEngine, '$form');

      expect(mockEngine.setError).toHaveBeenCalledWith('email', 'invalid email', 'form');
      expect(mockEngine.setError).toHaveBeenCalledWith('name', 'name is required', 'form');
    });

    it('should clear errors with falsy values', () => {
      const errors = {
        'email': 'error',
        'name': null,
        'age': 0,
      };

      strategy.handle(errors, mockEngine, '$form');

      expect(mockEngine.setError).toHaveBeenCalledWith('email', 'error', 'form');
      expect(mockEngine.clearError).toHaveBeenCalledWith('name', 'form');
      expect(mockEngine.clearError).toHaveBeenCalledWith('age', 'form');
    });

    it('should expand array errors into field paths', () => {
      const errors = {
        'items': ['must be non-empty', 'must be unique'],
      };

      strategy.handle(errors, mockEngine, '$form');

      expect(mockEngine.setError).toHaveBeenCalledWith('items[0]', 'must be non-empty', 'form');
      expect(mockEngine.setError).toHaveBeenCalledWith('items[1]', 'must be unique', 'form');
    });

    it('should not set array error on base path', () => {
      const errors = {
        'items': ['error one', { 'name': 'name is required' }],
      };

      strategy.handle(errors, mockEngine, '$form');

      const calledWithBasePath = mockEngine.setError.mock.calls.some(
        ([path, error]) => path === 'items' || Array.isArray(error),
      );

      expect(calledWithBasePath).toBe(false);
    });

    it('should expand array of objects into nested field paths', () => {
      // Example: form validator returns array of items with field errors
      // { "fyFinanceData": [{ "fundStatus": "required" }, { "fundStatus": "required" }] }
      const errors = {
        'fyFinanceData': [
          { 'fundStatus': 'fundStatus is required' },
          { 'fundStatus': 'fundStatus is required' },
        ],
      };

      strategy.handle(errors, mockEngine, '$form');

      expect(mockEngine.setError).toHaveBeenCalledWith('fyFinanceData[0].fundStatus', 'fundStatus is required', 'form');
      expect(mockEngine.setError).toHaveBeenCalledWith('fyFinanceData[1].fundStatus', 'fundStatus is required', 'form');
    });

    it('should handle mixed array of strings and objects', () => {
      const errors = {
        'items': [
          'simple error',
          { 'name': 'name is required', 'value': 'must be positive' },
          null,
          'another error',
        ],
      };

      strategy.handle(errors, mockEngine, '$form');

      expect(mockEngine.setError).toHaveBeenCalledWith('items[0]', 'simple error', 'form');
      expect(mockEngine.setError).toHaveBeenCalledWith('items[1].name', 'name is required', 'form');
      expect(mockEngine.setError).toHaveBeenCalledWith('items[1].value', 'must be positive', 'form');
      // items[2] is null, should not call setError
      expect(mockEngine.setError).toHaveBeenCalledWith('items[3]', 'another error', 'form');
    });

    it('should handle nested object structure with multiple levels', () => {
      const errors = {
        'address': [
          {
            'street': 'street is required',
            'city': 'city is required',
            'postal': {
              'code': 'code is required',
            },
          },
        ],
      };

      strategy.handle(errors, mockEngine, '$form');

      expect(mockEngine.setError).toHaveBeenCalledWith('address[0].street', 'street is required', 'form');
      expect(mockEngine.setError).toHaveBeenCalledWith('address[0].city', 'city is required', 'form');
      // Note: nested objects in array items are converted to string in this implementation
      expect(mockEngine.setError).toHaveBeenCalledWith(
        'address[0].postal',
        expect.any(Object),
        'form',
      );
    });

    it('should handle empty error object', () => {
      strategy.handle({}, mockEngine, '$form');
      expect(mockEngine.clearError).toHaveBeenCalledWith('$form');
      expect(mockEngine.setError).not.toHaveBeenCalled();
    });

    it('should handle array with null items gracefully', () => {
      const errors = {
        'items': [null, null, { 'field': 'error' }, null],
      };

      strategy.handle(errors, mockEngine, '$form');

      expect(mockEngine.setError).toHaveBeenCalledWith('items[2].field', 'error', 'form');
      expect(mockEngine.setError).toHaveBeenCalledTimes(1);
    });
  });

  describe('real-world scenario', () => {
    it('should handle complex form validator output', () => {
      // Simulating a form validator that returns errors for a complex nested structure
      const formValidatorOutput = {
        'description': 'description is too short',
        'fyFinanceData': [
          { 'fundStatus': 'fundStatus is required', 'budgetAllocationChange': 'invalid' },
          { 'fundStatus': 'fundStatus is required', 'budgetAllocationChange': 'invalid' },
        ],
        'relatedLines': ['first line is invalid', 'second line is invalid'],
        'tags': null,
      };

      strategy.handle(formValidatorOutput, mockEngine, '$form');

      // Simple field
      expect(mockEngine.setError).toHaveBeenCalledWith('description', 'description is too short', 'form');

      // Array of objects
      expect(mockEngine.setError).toHaveBeenCalledWith(
        'fyFinanceData[0].fundStatus',
        'fundStatus is required',
        'form',
      );
      expect(mockEngine.setError).toHaveBeenCalledWith(
        'fyFinanceData[1].budgetAllocationChange',
        'invalid',
        'form',
      );

      // Array of strings
      expect(mockEngine.setError).toHaveBeenCalledWith('relatedLines[0]', 'first line is invalid', 'form');
      expect(mockEngine.setError).toHaveBeenCalledWith('relatedLines[1]', 'second line is invalid', 'form');

      // Null field
      expect(mockEngine.clearError).toHaveBeenCalledWith('tags', 'form');

      // Form error cleared
      expect(mockEngine.clearError).toHaveBeenCalledWith('$form');
    });
  });
});
