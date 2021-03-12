import React from 'react';
import { render, screen } from '@testing-library/react';

import LocationFilter from './LocationFilter';

const renderComponent = (props = {}) => (render(
  <LocationFilter
    labelId="location filter"
    name="location-filter"
    onChange={() => { }}
    {...props}
  />,
));

describe('LocationFilter', () => {
  it('should display location filter label', () => {
    renderComponent();
    expect(screen.getByText('location filter')).toBeDefined();
  });

  it('should display entered filter', () => {
    renderComponent({ activeFilter: 'some location' });
    expect(screen.getByLabelText('location filter').value).toBe('some location');
  });
});
