import { render } from '@folio/jest-config-stripes/testing-library/react';

import TagsBadgeContainer from './TagsBadgeContainer';
import TagsBadge from './TagsBadge';

jest.mock('./TagsBadge', () => {
  return jest.fn(() => 'TagsBadge');
});

const renderComponent = (props = {}) => (render(
  <TagsBadgeContainer
    {...props}
  />,
));

describe('TagsBadgeContainer', () => {
  const tagsToggle = jest.fn();
  const tagsQuantity = 0;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass tagsEnabled as true', () => {
    const records = [{
      value: 'true',
    }];

    renderComponent({
      tagsToggle,
      tagsQuantity,
      resources: {
        configTags: { records },
      },
    });
    expect(TagsBadge.mock.calls[0][0].tagsEnabled).toEqual(true);
  });
});
