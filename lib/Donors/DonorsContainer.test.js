import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import { DonorsContainer } from './DonorsContainer';
import { useFetchDonors } from './hooks';

const mockVendor = { id: '1', name: 'Amazon' };

jest.mock('./DonorsList', () => ({
  DonorsList: jest.fn(({ contentData }) => {
    return (
      <div>
        {contentData.map(({ name }) => (
          <div key={name}>{name}</div>
        ))}
      </div>
    );
  }),
}));

jest.mock('./DonorsLookup', () => ({
  DonorsLookup: jest.fn(({ onAddDonors }) => {
    return (
      <div>
        <button
          type="button"
          onClick={() => onAddDonors([mockVendor])}
        >
          Add donor
        </button>
      </div>
    );
  }),
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
  donorIds: [
    '1',
    '2',
  ],
  formatter: {},
  donors: [],
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
