import { QueryClient, QueryClientProvider } from 'react-query';
import { render, cleanup } from '@testing-library/react';
import user from '@testing-library/user-event';

import PluggableDonorFilter from './PluggableDonorFilter';

const mockVendorData = { id: '1', name: 'Amazon' };

jest.mock('../Donors', () => ({
  ...jest.requireActual('../Donors'),
  useFetchDonors: jest.fn(() => ({
    isLoading: false,
    donors: [],
  })),
  DonorsLookup: jest.fn(({ children, ...rest }) => {
    return (
      <div>
        {children}
        <button
          type="button"
          id={rest?.name}
          onClick={() => rest?.onAddDonors([mockVendorData])}
        >
          Add donor
        </button>
      </div>
    );
  }),
}));

const labelId = 'ui-orders.orderDetails.assignedTo';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderFilter = (props) => (render(
  <PluggableDonorFilter
    id="donor"
    activeFilters={[]}
    labelId={labelId}
    name="donor"
    onChange={() => {}}
    {...props}
  />,
  { wrapper },
));

describe('PluggableDonorFilter', () => {
  afterEach(cleanup);

  it('should render component', () => {
    const { getAllByText } = renderFilter();

    expect(getAllByText(labelId)).toHaveLength(2);
  });

  it('should add donor', () => {
    const mockOnAddDonors = jest.fn();
    const { getByText } = renderFilter({ onChange: mockOnAddDonors });

    const addDonorsButton = getByText('Add donor');

    expect(addDonorsButton).toBeDefined();
    user.click(addDonorsButton);
    expect(mockOnAddDonors).toHaveBeenCalledWith({ name: 'donor', values: [mockVendorData.id] });
  });
});
