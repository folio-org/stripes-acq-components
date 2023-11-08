import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import DonorsContainer from './DonorsContainer';
import { useFetchDonors } from './hooks';

const mockVendor = { id: '1', name: 'Amazon' };

jest.mock('./DonorsList', () => jest.fn(({ contentData }) => {
  if (!contentData.length) {
    return 'stripes-components.tableEmpty';
  }

  return contentData.map(({ name }) => <div key={name}>{name}</div>);
}));

jest.mock('./DonorsLookup', () => jest.fn(({ onAddDonors, name }) => {
  return (
    <button
      type="button"
      id={name}
      onClick={() => onAddDonors([mockVendor])}
    >
      Add donor
    </button>
  );
}));

const setDonorIds = jest.fn();

jest.mock('./hooks', () => ({
  useFetchDonors: jest.fn().mockReturnValue({
    donors: [],
    isLoading: false,
  }),
}));

const defaultProps = {
  columnMapping: {},
  columnWidths: {},
  donors: [],
  fields: {
    value: [
      '1',
      '2',
    ],
  },
  formatter: {},
  id: 'donors',
  setDonorIds,
  searchLabel: 'Search',
  showTriggerButton: true,
  visibleColumns: ['name'],
};

const renderForm = (props = {}) => (
  <form>
    <DonorsContainer
      {...defaultProps}
      {...props}
    />
    <button type="submit">Submit</button>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} {...props} />
  </MemoryRouter>,
));

describe('DonorsContainer', () => {
  beforeEach(() => {
    useFetchDonors.mockClear().mockReturnValue({
      donors: [],
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('Add donor')).toBeDefined();
  });

  it('should call `useFetchDonors` with `donorOrganizationIds`', () => {
    const mockData = [{ name: 'Amazon', code: 'AMAZ', id: '1' }];

    renderComponent({ donors: mockData });
    expect(screen.getByText(mockData[0].name)).toBeDefined();
  });

  it('should call `setDonorIds` when `onAddDonors` is called', async () => {
    renderComponent({
      donors: [mockVendor],
      fields: {
        value: [],
        push: jest.fn(),
      },
    });

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeDefined();
    await user.click(addDonorsButton);
    expect(setDonorIds).toHaveBeenCalled();
  });

  it('should not render `DonorsLookup` when `showTriggerButton` is false', () => {
    renderComponent({ showTriggerButton: false });

    expect(screen.queryByText('Add donor')).toBeNull();
  });
});
