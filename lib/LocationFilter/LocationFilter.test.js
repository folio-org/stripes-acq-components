import React from 'react';
import { render, screen } from '@testing-library/react';

import LocationFilter from './LocationFilter';

const labelId = 'locationFilter';
const activeFilter = 'someLocation';

const renderComponent = (props = {}) => (render(
  <LocationFilter
    labelId={labelId}
    name="location-filter"
    onChange={() => { }}
    id="locationAccordion"
    {...props}
  />,
));

describe('LocationFilter', () => {
  it('should display location filter label', () => {
    renderComponent();
    expect(screen.getByText(labelId)).toBeDefined();
  });

  it('should display entered filter', () => {
    renderComponent({ activeFilter });
    expect(screen.getByRole('textbox').value).toBe(activeFilter);
  });
});
