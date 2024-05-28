import {
  render,
  screen,
  within,
} from '@testing-library/react';

import {
  ConsortiumLocationsContext,
  LocationsContext,
} from '../contexts';
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
  onChange: jest.fn(),
  name: 'location-filter',
  crossTenant: false,
};

const ContextProviderMock = jest.fn(({ children }) => children);
const configureContextProviderMock = (Context, value) => {
  ContextProviderMock
    .mockClear()
    .mockImplementation(({ children }) => {
      return (
        <Context.Provider value={value}>
          {children}
        </Context.Provider>
      );
    });
};

const renderComponent = (props = {}) => render(
  <LocationFilter
    {...defaultProps}
    {...props}
  />,
  { wrapper: ContextProviderMock },
);

describe('LocationFilter', () => {
  beforeEach(() => {
    configureContextProviderMock(LocationsContext, { locations });
  });

  it('should display location filter label', () => {
    renderComponent();
    expect(screen.getByText(defaultProps.labelId)).toBeDefined();
  });

  it('should display entered filter', () => {
    const { container } = renderComponent();

    expect(
      within(container.querySelector('.multiSelectValueList')).getByText(locations[0].name),
    ).toBeInTheDocument();
  });

  describe('ECS mode', () => {
    beforeEach(() => {
      configureContextProviderMock(ConsortiumLocationsContext, { locations: locationsECS });
    });

    it('should display selected locations', () => {
      const { container } = renderComponent({
        activeFilter: [locationsECS[0].id],
        crossTenant: true,
      });

      expect(
        within(container.querySelector('.multiSelectValueList')).getByText(locationsECS[0].name),
      ).toBeInTheDocument();
    });
  });
});
