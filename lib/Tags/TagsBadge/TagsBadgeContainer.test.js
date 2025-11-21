import { render } from '@folio/jest-config-stripes/testing-library/react';

import { useTagsConfigs } from '../../hooks';
import TagsBadge from './TagsBadge';
import TagsBadgeContainer from './TagsBadgeContainer';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useTagsConfigs: jest.fn(),
}));
jest.mock('./TagsBadge', () => {
  return jest.fn(() => 'TagsBadge');
});

const defaultProps = {
  tagsToggle: jest.fn(),
  tagsQuantity: 0,
};

const renderComponent = (props = {}) => render(
  <TagsBadgeContainer
    {...defaultProps}
    {...props}
  />,
);

describe('TagsBadgeContainer', () => {
  beforeEach(() => {
    useTagsConfigs.mockReturnValue({ configs: [{ value: true }] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass tagsEnabled as true', () => {
    renderComponent();
    expect(TagsBadge.mock.calls[0][0].tagsEnabled).toEqual(true);
  });

  it('should pass tagsEnabled as false', () => {
    useTagsConfigs.mockReturnValue({ configs: [{ value: false }] });

    renderComponent();
    expect(TagsBadge.mock.calls[0][0].tagsEnabled).toEqual(false);
  });
});
