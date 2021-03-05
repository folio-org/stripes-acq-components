import { getErrorCodeFromResponse } from './getErrorCodeFromResponse';
import { ERROR_CODE_GENERIC } from '../constants';

describe('getErrorCodeFromResponse', () => {
  it('should return general error if response something plain', async () => {
    const errorCode = await getErrorCodeFromResponse();

    expect(errorCode).toEqual(ERROR_CODE_GENERIC);
  });

  it('should return first error code', async () => {
    const response = {
      json: jest.fn()
        .mockResolvedValueOnce({ errors: [{ code: 'some error code' }] }),
    };
    const errorCode = await getErrorCodeFromResponse(response);

    expect(errorCode).toEqual('some error code');
  });
});
