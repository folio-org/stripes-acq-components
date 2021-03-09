import React from 'react';
import { render, screen } from '@testing-library/react';

import TagsBadge from './TagsBadge';

const renderComponent = (props = {}) => (render(
  <TagsBadge
    {...props}
  />,
));

describe('TagsBadge', () => {
  const tagsToggle = jest.fn();
  const tagsQuantity = 0;

  beforeEach(() => {
    tagsToggle.mockClear();
  });

  it('should display icon if tags enabled', () => {
    renderComponent({ tagsEnabled: true, tagsToggle, tagsQuantity });
    expect(screen.getByLabelText('stripes-acq-components.showTags')).toBeDefined();
  });

  it('should not display icon button if tags are not enabled', () => {
    renderComponent({ tagsEnabled: false, tagsToggle, tagsQuantity });
    expect(screen.queryByLabelText('stripes-acq-components.showTags')).toBeNull();
  });
});
