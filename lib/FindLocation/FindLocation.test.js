import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { checkIfUserInCentralTenant } from '@folio/stripes/core';

import {
  campus,
  institution,
  library,
  location,
  tenants,
} from '../../test/jest/fixtures';
import {
  useCampuses,
  useConsortiumTenants,
  useInstitutions,
  useLibraries,
} from '../hooks';
import { fetchAllRecords } from '../utils';
import { FindLocation } from './FindLocation';

jest.mock('../AcqList', () => ({
  ...jest.requireActual('../AcqList'),
  useFiltersToogle: () => ({ isFiltersOpened: true, toggleFilters: jest.fn }),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useInstitutions: jest.fn(),
  useCampuses: jest.fn(),
  useConsortiumTenants: jest.fn(),
  useLibraries: jest.fn(),
}));
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  fetchAllRecords: jest.fn(),
}));

const defaultProps = {
  id: 'lookup',
  searchLabel: 'Search locations',
  onClose: jest.fn(),
  onRecordsSelect: jest.fn(),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderFindLocation = (props = {}) => render(
  <FindLocation
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('FindLocation', () => {
  beforeEach(() => {
    useInstitutions.mockReturnValue({ institutions: [institution] });
    useCampuses.mockReturnValue({ campuses: [campus] });
    useConsortiumTenants.mockReturnValue({ tenants });
    useLibraries.mockReturnValue({ libraries: [library] });
    fetchAllRecords.mockReturnValue([location]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render locations lookup trigger', () => {
    renderFindLocation();

    expect(screen.getByText(defaultProps.searchLabel)).toBeInTheDocument();
  });

  it('should open locations lookup when trigger clicked', async () => {
    renderFindLocation();

    await userEvent.click(screen.getByText(defaultProps.searchLabel));

    expect(screen.getByText('stripes-acq-components.find-location.modal.label')).toBeInTheDocument();
  });

  it('should open triggerless locations lookup', async () => {
    renderFindLocation({ triggerless: true });

    expect(screen.getByText('stripes-acq-components.find-location.modal.label')).toBeInTheDocument();
  });

  it('should open locations lookup by click on custom trigger', async () => {
    const triggerLabel = 'Custom trigger';

    renderFindLocation({
      renderTrigger: ({ buttonRef, onClick }) => (
        <button
          type="button"
          ref={buttonRef}
          onClick={onClick}
        >
          {triggerLabel}
        </button>
      ),
    });

    expect(screen.getByText(triggerLabel)).toBeInTheDocument();

    await userEvent.click(screen.getByText(triggerLabel));

    expect(screen.getByText('stripes-acq-components.find-location.modal.label')).toBeInTheDocument();
  });

  it('should close the modal on dismiss', async () => {
    renderFindLocation();

    await userEvent.click(screen.getByText(defaultProps.searchLabel));
    await userEvent.click(screen.getByText('stripes-acq-components.button.close'));

    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(screen.queryByText('stripes-acq-components.find-location.modal.label')).not.toBeInTheDocument();
  });

  describe('ECS enabled', () => {
    beforeEach(() => {
      checkIfUserInCentralTenant
        .mockClear()
        .mockReturnValue(true);
    });

    it('should render affiliations select dropdown', async () => {
      renderFindLocation({ crossTenant: true });

      await userEvent.click(screen.getByText(defaultProps.searchLabel));

      expect(screen.getByText('stripes-acq-components.consortia.affiliations.select.label')).toBeInTheDocument();
    });
  });
});
