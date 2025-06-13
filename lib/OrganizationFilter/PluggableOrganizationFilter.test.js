import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { vendor } from 'fixtures';
import PluggableOrganizationFilter from './PluggableOrganizationFilter';

const labelId = 'ui-orders.orderDetails.assignedTo';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderFilter = () => render(
  <PluggableOrganizationFilter
    id="vendor"
    activeFilters={[]}
    labelId={labelId}
    name="vendor"
    onChange={() => {}}
  />,
  { wrapper },
);

describe('Given PluggableOrganizationFilter component', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(vendor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText(labelId)).toBeInTheDocument();
  });
});
