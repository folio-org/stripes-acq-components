/* Developed collaboratively using AI (GitHub Copilot) */

import { ERROR_CODE_GENERIC } from '../../constants';
import { ResponseErrorContainer } from './ResponseErrorContainer';
import { ResponseErrorsContainer } from './ResponseErrorsContainer';

describe('ResponseErrorsContainer', () => {
  let mockResponse; let mockResponseBody; let
    errorStrategy;

  beforeEach(() => {
    mockResponseBody = {
      errors: [
        { code: 'foo', message: 'Something went wrong' },
        { code: 'bar', message: 'Internal server error' },
      ],
      total_records: 2,
    };

    mockResponse = {
      clone: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue(mockResponseBody),
      status: 500,
    };

    errorStrategy = {
      handle: jest.fn(),
    };
  });

  it('should create an instance with response body and status', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    expect(handler).toBeInstanceOf(ResponseErrorsContainer);
    expect(handler.status).toBe(500); // Check HTTP status
    expect(handler.totalRecords).toBe(2); // Check total records
  });

  it('should create a handler when response contains a single error object', async () => {
    const singleErrorBody = { code: 'baz', message: 'Bad Request' };

    mockResponse.json.mockResolvedValueOnce(singleErrorBody);

    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    expect(handler).toBeInstanceOf(ResponseErrorsContainer);
    expect(handler.errorMessages).toEqual(['Bad Request']);
  });

  it('should return error messages as an array', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    expect(handler.errorMessages).toEqual(['Something went wrong', 'Internal server error']);
  });

  it('should return error codes as an array', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    expect(handler.errorCodes).toEqual(['foo', 'bar']);
  });

  it('should return all errors as an array of ResponseErrorContainer instances', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);
    const errors = handler.errors;

    expect(errors).toHaveLength(2);
    expect(errors[0]).toBeInstanceOf(ResponseErrorContainer);
    expect(errors[1].code).toBe('bar');
  });

  it('should return all errors as a map', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);
    const errorsMap = handler.getErrors();

    expect(errorsMap.size).toBe(2); // Check size of map
    expect(errorsMap.get('foo').message).toBe('Something went wrong'); // Check first error
  });

  it('should get a specific error by code', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);
    const error = handler.getError('foo');

    expect(error).toBeInstanceOf(ResponseErrorContainer);
    expect(error.code).toBe('foo');
    expect(error.message).toBe('Something went wrong');
  });

  it('should return the first error when no code is provided', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);
    const error = handler.getError();

    expect(error.code).toBe('foo');
  });

  it('should return a generic error when the requested code is not found', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);
    const error = handler.getError('999'); // Code that does not exist

    expect(error.code).toBe(ERROR_CODE_GENERIC); // Fallback to generic error
  });

  it('should normalize string error to structured error container', () => {
    const stringError = 'This is an error';
    const handler = new ResponseErrorsContainer({ errors: [stringError], total_records: 1 }, mockResponse);

    const error = handler.getError();

    expect(error.message).toBe(stringError);
    expect(error.code).toBe(ERROR_CODE_GENERIC);
  });

  it('should normalize invalid JSON error string to generic error', () => {
    const invalidJsonError = '{"invalidJson": true';
    const handler = new ResponseErrorsContainer({ errors: [invalidJsonError], total_records: 1 }, mockResponse);

    const error = handler.getError();

    expect(error.message).toBe(invalidJsonError); // Should return the original string
    expect(error.code).toBe(ERROR_CODE_GENERIC);
  });

  it('should handle unknown objects without message by converting them to a string', () => {
    const unknownError = { invalid: 'no message' };
    const handler = new ResponseErrorsContainer({ errors: [unknownError], total_records: 1 }, mockResponse);

    const error = handler.getError();

    expect(error.message).toBe(JSON.stringify(unknownError)); // Should stringify the object
    expect(error.code).toBe(ERROR_CODE_GENERIC);
  });

  it('should handle response errors using a provided strategy', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    handler.handle(errorStrategy);
    expect(errorStrategy.handle).toHaveBeenCalledWith(handler); // Ensure strategy is invoked with the handler
  });

  it('should handle empty error body by returning generic error', async () => {
    mockResponse.json.mockResolvedValueOnce({}); // Empty body
    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    const error = handler.getError();

    expect(error.code).toBe(ERROR_CODE_GENERIC);
  });
});
