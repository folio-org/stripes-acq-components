import { getResultsFormatter } from './utils';

describe('getResultsFormatter', () => {
  it('should return object with name, code and unassignDonor functions', () => {
    const result = getResultsFormatter({});

    expect(result).toEqual(expect.objectContaining({
      name: expect.any(Function),
      code: expect.any(Function),
      unassignDonor: expect.any(Function),
    }));
  });
});
