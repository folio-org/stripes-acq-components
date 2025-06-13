import { useLocalStorage } from '@rehooks/local-storage';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { tenants } from '../../test/jest/fixtures';
import {
  useCampusesQuery,
  useConsortiumTenants,
  useCurrentUserTenants,
  useInstitutionsQuery,
  useLibrariesQuery,
} from '../hooks';
import { FindLocationLookup } from './FindLocationLookup';
import {
  useLocationsList,
  useLocationsRecords,
} from './hooks';

jest.mock('@rehooks/local-storage', () => ({
  useLocalStorage: jest.fn(),
}));

jest.mock('../AcqList', () => ({
  ...jest.requireActual('../AcqList'),
  useFiltersToogle: () => ({ isFiltersOpened: true, toggleFilters: jest.fn }),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useCampusesQuery: jest.fn(),
  useConsortiumTenants: jest.fn(),
  useCurrentUserTenants: jest.fn(),
  useEventEmitter: jest.fn().mockReturnValue({
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }),
  useInstitutionsQuery: jest.fn(),
  useLibrariesQuery: jest.fn(),
}));
jest.mock('./hooks', () => ({
  useLocationsList: jest.fn(),
  useLocationsRecords: jest.fn(),
}));

const setItem = jest.fn();
const removeItem = jest.fn();
const mockTenants = [
  {
    id: tenants[0].id,
    name: tenants[0].name,
    isPrimary: true,
  },
  {
    id: tenants[1].id,
    name: tenants[1].name,
    isPrimary: false,
  },
];

const renderFindLocationLookup = (props) => render(
  <FindLocationLookup
    affiliationsLabel="affiliationsLabel"
    crossTenant
    filterRecords={jest.fn()}
    idPrefix="idPrefix"
    isMultiSelect
    modalLabel="modalLabel"
    onRecordsSelect={jest.fn()}
    resultsPaneTitle="resultsPaneTitle"
    sortableColumns={['sortableColumns']}
    tenantId={mockTenants[0].id}
    visibleColumns={['visibleColumns']}
    {...props}
  />,
);

describe('FindLocationLookup', () => {
  beforeEach(() => {
    useCampusesQuery.mockReturnValue({
      campuses: [],
      isLoading: false,
    });
    useConsortiumTenants.mockReturnValue({
      tenants: mockTenants,
      isLoading: false,
    });
    useInstitutionsQuery.mockReturnValue({
      institutions: [],
      isLoading: false,
    });
    useLibrariesQuery.mockReturnValue({
      libraries: [],
      isLoading: false,
    });
    useLocationsList.mockReturnValue({ locations: [] });
    useLocationsRecords.mockReturnValue({
      locations: [],
      isLoading: false,
    });
    useLocalStorage.mockReturnValue([
      null,
      setItem,
      removeItem,
    ]);
    useCurrentUserTenants.mockReturnValue(mockTenants);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render FindRecords component', () => {
    const { getByText } = renderFindLocationLookup();

    expect(getByText('resultsPaneTitle')).toBeDefined();
  });

  it('should clear filters on tenant change', async () => {
    const onTenantChange = jest.fn();

    useInstitutionsQuery.mockReturnValue({
      institutions: [
        {
          'id': 'a0ba27d5-aa76-4bfb-904d-1ba9b80ab882',
          'tenantId': 'cs00000int',
          'name': 'Test 1',
        },
      ],
      isLoading: false,
    });
    useCampusesQuery.mockReturnValue({
      campuses: [{
        'id': '124da306-a838-40c4-812d-4e2d1e82ebdd',
        'tenantId': 'cs00000int',
        'name': 'Campus 1',
        'institutionId': '9d1b77e5-f02e-4b7f-b296-3f2042ddac54',
      }],
      isLoading: false,
    });
    useLibrariesQuery.mockReturnValue({
      libraries: [{
        'id': '563e0d8b-180d-45fb-abfe-5d0696ba4f60',
        'tenantId': 'cs00000int',
        'name': 'library',
        'campusId': '124da306-a838-40c4-812d-4e2d1e82ebdd',
      }],
      isLoading: false,
    });
    useLocationsList.mockReturnValue({
      locations: [
        {
          'id': '65578bd8-0e87-472e-8579-9db5cfe846dc',
          'name': 'Folio name',
          'tenantId': 'cs00000int',
          'code': 'location-new',
          'discoveryDisplayName': 'Location new',
          'isActive': 'true',
          'institutionId': '9d1b77e5-f02e-4b7f-b296-3f2042ddac54',
          'campusId': '124da306-a838-40c4-812d-4e2d1e82ebdd',
          'libraryId': '563e0d8b-180d-45fb-abfe-5d0696ba4f60',
          'primaryServicePoint': '9d1b77e8-f02e-4b7f-b296-3f2042ddac54',
          'servicePointIds': [
            '9d1b77e8-f02e-4b7f-b296-3f2042ddac54',
          ],
          'campus': {
            'id': '124da306-a838-40c4-812d-4e2d1e82ebdd',
            'tenantId': 'cs00000int',
            'name': 'Campus 1',
            'institutionId': '9d1b77e5-f02e-4b7f-b296-3f2042ddac54',
          },
          'library': {
            'id': '563e0d8b-180d-45fb-abfe-5d0696ba4f60',
            'tenantId': 'cs00000int',
            'name': 'library',
            'campusId': '124da306-a838-40c4-812d-4e2d1e82ebdd',
          },
        },
      ],
    });

    renderFindLocationLookup({ onTenantChange });

    const affiliationSelection = await screen.findByText('affiliationsLabel');

    expect(affiliationSelection).toBeInTheDocument();

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText(mockTenants[1].name));

    expect(onTenantChange).toHaveBeenCalledWith(mockTenants[1].id);
  });
});
