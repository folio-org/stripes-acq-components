import { QueryClient, QueryClientProvider } from 'react-query';
import { render, cleanup } from '@testing-library/react';
import user from '@testing-library/user-event';

import PluggableDonorFilter from './PluggableDonorFilter';

const mockVendorData = { id: '1', name: 'Amazon' };

jest.mock('../Donors', () => ({
  ...jest.requireActual('../Donors'),
  useFetchDonors: jest.fn(() => ({
    isLoading: false,
    donors: [{ id: '1', name: 'Amazon' }],
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
    name={mockVendorData.name}
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
    expect(mockOnAddDonors).toHaveBeenCalledWith({
      name: mockVendorData.name,
      values: [mockVendorData.id],
    });
  });

  it('should clear all donors', () => {
    const mockOnAddDonors = jest.fn();
    const { getAllByRole } = renderFilter({
      onChange: mockOnAddDonors,
      activeFilters: [mockVendorData.id],
    });

    const clearAllButton = getAllByRole('button')[1];

    expect(clearAllButton).toBeDefined();
    user.click(clearAllButton);
    expect(mockOnAddDonors).toHaveBeenCalledWith({
      name: mockVendorData.name,
      values: [],
    });
  });
});
