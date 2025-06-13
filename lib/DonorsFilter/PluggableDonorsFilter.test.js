import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { PluggableDonorsFilter } from './PluggableDonorsFilter';

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
  <PluggableDonorsFilter
    id="donor"
    activeFilters={[]}
    labelId={labelId}
    name={mockVendorData.name}
    onChange={() => {}}
    {...props}
  />,
  { wrapper },
));

describe('PluggableDonorsFilter', () => {
  it('should render component', () => {
    const { getAllByText } = renderFilter();

    expect(getAllByText(labelId)).toHaveLength(2);
  });

  it('should add donor', async () => {
    const mockOnAddDonors = jest.fn();
    const { getByText } = renderFilter({ onChange: mockOnAddDonors });

    const addDonorsButton = getByText('Add donor');

    expect(addDonorsButton).toBeInTheDocument();

    await userEvent.click(addDonorsButton);

    expect(mockOnAddDonors).toHaveBeenCalledWith({
      name: mockVendorData.name,
      values: [mockVendorData.id],
    });
  });

  it('should clear all donors', async () => {
    const mockOnAddDonors = jest.fn();
    const { getAllByRole } = renderFilter({
      onChange: mockOnAddDonors,
      activeFilters: [mockVendorData.id],
    });

    const clearAllButton = getAllByRole('button')[1];

    expect(clearAllButton).toBeInTheDocument();

    await userEvent.click(clearAllButton);

    expect(mockOnAddDonors).toHaveBeenCalledWith({
      name: mockVendorData.name,
      values: [],
    });
  });
});
