import { render } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import PluggableUserFilter from './PluggableUserFilter';

const userFilterLabel = 'ui-orders.orderDetails.assignedTo';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderUserFilter = () => render(
  <PluggableUserFilter
    id="assignTo"
    activeFilters={[]}
    labelId={userFilterLabel}
    name="assignToFilter"
    onChange={() => {}}
  />,
  { wrapper },
);

describe('Given PluggableUserFilter component', () => {
  const getMock = jest.fn().mockReturnValue({
    json: () => Promise.resolve(({ id: 'userId' })),
  });

  beforeEach(() => {
    getMock.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: getMock });
  });

  it('should display passed title', () => {
    const { getByText } = renderUserFilter();

    expect(getByText(userFilterLabel)).toBeInTheDocument();
  });
});
