import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import LocationFilterContainer from './LocationFilterContainer';
import LocationFilter from './LocationFilter';

const LOCATIONS = [{ id: '1', name: 'location 1' }];

jest.mock('./LocationFilter', () => {
  return jest.fn(() => 'LocationFilter');
});

const renderComponent = (props = {}) => (render(
  <LocationFilterContainer
    onChange={() => {}}
    labelId="location.filter"
    name="location-filter"
    {...props}
  />,
));

describe('LocationFilterContainer', () => {
  beforeEach(() => {
    LocationFilter.mockClear();
  });

  it('should display LocationFilter', () => {
    renderComponent();
    expect(screen.getByText('LocationFilter')).toBeDefined();
  });

  it('should pass preselected filter', async () => {
    const mutator = {
      locationFilterLocations: {
        GET: jest.fn().mockResolvedValue(LOCATIONS),
        reset: jest.fn(),
      },
    };

    renderComponent({ mutator, activeFilter: '1' });
    await waitFor(() => expect(LocationFilter.mock.calls[1][0].activeFilter).toEqual(LOCATIONS[0].name));
  });
});
