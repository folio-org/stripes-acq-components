import { renderHook } from '@testing-library/react-hooks';
import keyBy from 'lodash/keyBy';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  campus,
  institution,
  library,
  location,
} from '../../../../test/jest/fixtures';
import { fetchAllRecords } from '../../../utils';
import { useLocationsRecords } from './useLocationsRecords';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  fetchAllRecords: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

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
  beforeEach(() => {
    fetchAllRecords
      .mockClear()
      .mockReturnValue([location]);
  });

  it('should return processed locations', async () => {
    const { result, waitFor } = renderHook(() => useLocationsRecords(options), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.locations).toEqual([{
      ...location,
      campus,
      institution,
      library,
    }]);
  });
});
