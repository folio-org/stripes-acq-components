import { fetchAllRecords } from './fetchAllRecords';

describe('fetchAllRecords', () => {
  it('should call GET API once, as well as reset', () => {
    const mutatorFn = {
      GET: jest.fn(),
      reset: jest.fn(),
    };

    fetchAllRecords(mutatorFn);
    expect(mutatorFn.reset).toHaveBeenCalledTimes(1);
    expect(mutatorFn.GET).toHaveBeenCalledTimes(1);
  });

  it('should call GET API once', () => {
    const mutatorFn = {
      GET: jest.fn()
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([]),
    };

    fetchAllRecords(mutatorFn, '?param1=value1');
    expect(mutatorFn.GET).toHaveBeenCalledTimes(1);
  });
});
