import { ERROR_CODES, handleValidationErrorResponse } from './handleValidationErrorResponse';

const callback = jest.fn();

describe('handleValidationErrorResponse', () => {
  beforeEach(() => {
    callback.mockClear();
  });

  it('should return validation error from response for invalid fund distribution total', async () => {
    const error = await handleValidationErrorResponse({
      response: {
        json: () => ({
          errors: [{
            code: ERROR_CODES.incorrectFundDistributionTotal,
            parameters: [{
              key: 'remainingAmount',
              value: 0.01,
            }],
          }],
        }),
      },
    }, callback);

    expect(callback).toHaveBeenCalled();
    expect(error).toBeDefined();
  });

  it('should return validation error for mixed percentage and amount values with 0 estimated price', async () => {
    const error = await handleValidationErrorResponse({
      errors: [{
        code: ERROR_CODES.cannotMixTypesForZeroPrice,
      }],
    });

    expect(error).toBeDefined();
  });

  it('should return validation error from response with unknown error code', async () => {
    const error = await handleValidationErrorResponse({
      errors: [{
        code: 'fooBar',
        message: 'Some error from response',
      }],
    });

    expect(error).toBeDefined();
  });
});
