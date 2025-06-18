import {
  render,
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';

import LocationFilter from './LocationFilter';

const locations = [
  { id: 'location-1', name: 'Test non-ECS location 1' },
  { id: 'location-2', name: 'Test non-ECS location 2' },
  { id: 'location-3', name: 'Test non-ECS location 3' },
];

const locationsECS = [
  {
    id: 'ecs-location-1',
    name: 'Test ECS location 1',
    tenantId: 'test-tenant',
  },
  {
    id: 'ecs-location-2',
    name: 'Test ECS location 2',
    tenantId: 'test-tenant',
  },
];

const defaultProps = {
  activeFilter: [locations[0].id],
  id: 'locationAccordion',
  labelId: 'locationFilterLabelId',
  locations,
  onChange: jest.fn(),
  name: 'location-filter',
  crossTenant: false,
};

const renderComponent = (props = {}) => render(
  <LocationFilter
    {...defaultProps}
    {...props}
  />,
);

describe('LocationFilter', () => {
  it('should display location filter label', () => {
    renderComponent();
    expect(screen.getByText(defaultProps.labelId)).toBeInTheDocument();
  });

  it('should display entered filter', () => {
    const { container } = renderComponent();

    expect(
      within(container.querySelector('.multiSelectValueList')).getByText(locations[0].name),
    ).toBeInTheDocument();
  });

  describe('ECS mode', () => {
    it('should display selected locations', () => {
      const { container } = renderComponent({
        activeFilter: [locationsECS[0].id],
        crossTenant: true,
        locations: locationsECS,
      });

      expect(
        within(container.querySelector('.multiSelectValueList')).getByText(locationsECS[0].name),
      ).toBeInTheDocument();
    });
  });
});
