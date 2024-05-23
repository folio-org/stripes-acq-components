import {
  render,
  screen,
  within,
} from '@testing-library/react';

import {
  ConsortiumLocationsContext,
  ConsortiumLocationsContextProvider,
  LocationsContext,
  LocationsContextProvider,
} from '../contexts';
import LocationFilterContainer from './LocationFilterContainer';

const locations = [{ id: '1', name: 'location 1' }];

jest.mock('../contexts', () => ({
  ...jest.requireActual('../contexts'),
  ConsortiumLocationsContextProvider: jest.fn(({ children }) => children),
  LocationsContextProvider: jest.fn(({ children }) => children),
}));

const defaultProps = {
  onChange: jest.fn(),
  labelId: 'location.filter',
  name: 'location-filter',
};

const configureContextProviderMock = (ContextProviderMock, Context, value) => {
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
  <LocationFilterContainer
    {...defaultProps}
    {...props}
  />,
);

describe('LocationFilterContainer', () => {
  beforeEach(() => {
    configureContextProviderMock(
      LocationsContextProvider,
      LocationsContext,
      { locations },
    );
  });

  it('should display location filter', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.labelId)).toBeInTheDocument();
  });

  it('should pass preselected filter', async () => {
    const { container } = renderComponent({ activeFilter: [locations[0].id] });

    expect(
      within(container.querySelector('.multiSelectValueList')).getByText(locations[0].name),
    ).toBeInTheDocument();
  });

  describe('ECS mode', () => {
    beforeEach(() => {
      configureContextProviderMock(
        ConsortiumLocationsContextProvider,
        ConsortiumLocationsContext,
        { locations },
      );
    });

    it('should pass preselected filter', async () => {
      const { container } = renderComponent({
        activeFilter: [locations[0].id],
        crossTenant: true,
      });

      expect(
        within(container.querySelector('.multiSelectValueList')).getByText(locations[0].name),
      ).toBeInTheDocument();
    });
  });
});
