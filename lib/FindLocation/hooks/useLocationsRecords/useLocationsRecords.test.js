import keyBy from 'lodash/keyBy';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  campus,
  institution,
  library,
  location,
} from '../../../../test/jest/fixtures';
import {
  ConsortiumLocationsContext,
  LocationsContext,
} from '../../../contexts';
import { useLocationsRecords } from './useLocationsRecords';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  fetchAllRecords: jest.fn(),
}));

let crossTenant;

const queryClient = new QueryClient();

const wrapper = ({ children }) => {
  const Context = crossTenant
    ? ConsortiumLocationsContext
    : LocationsContext;

  return (
    <Context.Provider value={{ locations: [location] }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Context.Provider>
  );
};

const options = {
  filters: {},
  filterRecords: jest.fn((data) => data),
  selectedLocations: [],
  initialSelected: [],
  institutionsMap: keyBy([institution], 'id'),
  campusesMap: keyBy([campus], 'id'),
  librariesMap: keyBy([library], 'id'),
};

describe('useLocationsRecords', () => {
  it('should return processed locations', async () => {
    crossTenant = false;
    const { result } = renderHook(() => useLocationsRecords({ ...options, crossTenant }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.locations).toEqual([{
      ...location,
      campus,
      institution,
      library,
    }]);
  });

  describe('ECS mode', () => {
    it('should return processed locations', async () => {
      crossTenant = true;
      const { result } = renderHook(() => useLocationsRecords({ ...options, crossTenant }), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.locations).toEqual([{
        ...location,
        campus,
        institution,
        library,
      }]);
    });
  });
});
