import { ERROR_CODE_GENERIC } from '../../constants';
import { ResponseErrorsContainer } from './ResponseErrorsContainer';
import { ResponseErrorContainer } from './ResponseErrorContainer';

describe('ResponseErrorsContainer', () => {
  let mockResponse; let
    mockResponseBody;

  beforeEach(() => {
    mockResponseBody = {
      errors: [{ code: '404', message: 'Not found' }],
      total_records: 1,
    };
    mockResponse = {
      clone: jest.fn().mockReturnThis(),
      json: jest.fn().mockResolvedValue(mockResponseBody),
      status: 404,
    };
  });

  it('should create a new ResponseErrorsContainer instance from a response', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    expect(handler).toBeInstanceOf(ResponseErrorsContainer);
    expect(handler.status).toBe(404); // Check for status
    expect(handler.errorMessages).toEqual(['Not found']);
  });

  it('should return a specific error by code', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);
    const error = handler.getError('404');

    expect(error).toBeInstanceOf(ResponseErrorContainer);
    expect(error.message).toBe('Not found');
    expect(error.code).toBe('404');
  });

  it('should handle unknown errors', async () => {
    const mockUnknownError = { errors: ['Unknown error'] };

    mockResponse.json.mockResolvedValueOnce(mockUnknownError);

    const { handler } = await ResponseErrorsContainer.create(mockResponse);

    expect(handler.errorMessages).toEqual(['Unknown error']);
  });

  it('should return generic error when no error code is found', async () => {
    const { handler } = await ResponseErrorsContainer.create(mockResponse);
    const error = handler.getError('500');

    expect(error.code).toBe(ERROR_CODE_GENERIC);
  });
});
