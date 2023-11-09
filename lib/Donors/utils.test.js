import {
  getDonorsListFormatter,
  getDonorsFormatter,
} from './utils';

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
    }));
  });
});

describe('getDonorsFormatter', () => {
  it('should return object with name, code and unassignDonor functions', () => {
    const result = getDonorsFormatter(defaultProps);

    expect(result).toEqual(expect.objectContaining({
      unassignDonor: expect.any(Function),
    }));
  });
});
