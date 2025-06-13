import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import TagsBadge from './TagsBadge';

const renderComponent = (props = {}) => (render(
  <TagsBadge
    {...props}
  />,
));

describe('TagsBadge', () => {
  const tagsToggle = jest.fn();
  const tagsQuantity = 0;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display icon if tags enabled', () => {
    renderComponent({ tagsEnabled: true, tagsToggle, tagsQuantity });

    expect(screen.getByLabelText('stripes-acq-components.showTags')).toBeInTheDocument();
  });

  it('should not display icon button if tags are not enabled', () => {
    renderComponent({ tagsEnabled: false, tagsToggle, tagsQuantity });

    expect(screen.queryByLabelText('stripes-acq-components.showTags')).not.toBeInTheDocument();
  });
});
