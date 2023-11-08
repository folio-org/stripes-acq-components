import { getResultsFormatter } from './utils';

const defaultProps = {
  canViewOrganizations: true,
  fields: {
    remove: jest.fn(),
  },
  intl: {
    formatMessage: jest.fn((id) => id),
  },
};

describe('getResultsFormatter', () => {
  it('should return object with name, code and unassignDonor functions', () => {
    const result = getResultsFormatter(defaultProps);

    expect(result).toEqual(expect.objectContaining({
      name: expect.any(Function),
      code: expect.any(Function),
      unassignDonor: expect.any(Function),
    }));
  });
});
