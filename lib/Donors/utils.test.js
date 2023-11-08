import { getDonorsListFormatter } from './utils';

const defaultProps = {
  canViewOrganizations: true,
  fields: {
    remove: jest.fn(),
  },
  intl: {
    formatMessage: jest.fn((id) => id),
  },
};

describe('getDonorsListFormatter', () => {
  it('should return object with name, code and unassignDonor functions', () => {
    const result = getDonorsListFormatter(defaultProps);

    expect(result).toEqual(expect.objectContaining({
      name: expect.any(Function),
      code: expect.any(Function),
      unassignDonor: expect.any(Function),
    }));
  });
});
