import {
  getDonorsListFormatter,
  getDonorsFormatter,
} from './utils';

const mockOnRemove = jest.fn();
const defaultProps = {
  canViewOrganizations: true,
  fields: {
    remove: jest.fn(),
    value: ['1'],
  },
  intl: {
    formatMessage: jest.fn((id) => id),
  },
  onRemove: mockOnRemove,
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

    result.unassignDonor({ _index: 0 }).props.onClick({ preventDefault: jest.fn() });

    expect(defaultProps.fields.remove).toHaveBeenCalled();
    expect(mockOnRemove).toHaveBeenCalled();

    expect(result.name({ id: '1', name: 'name' })).toEqual(expect.objectContaining({
      props: expect.objectContaining({
        to: '/organizations/view/1',
        children: 'name',
      }),
    }));
  });

  it('should not return link to organization if canViewOrganizations is false', () => {
    const result = getDonorsFormatter({
      ...defaultProps,
      canViewOrganizations: false,
    });

    expect(result.name({ id: '1', name: 'name' })).toEqual('name');
  });
});
