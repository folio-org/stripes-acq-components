import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import stripesFinalForm from '@folio/stripes/final-form';

import DonorsContainer from './DonorsContainer';
import { useFetchDonors } from './hooks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('./DonorsList', () => jest.fn(({ donorsMap }) => {
  if (!Object.values(donorsMap).length) {
    return 'stripes-components.tableEmpty';
  }

  return Object.values(donorsMap).map(donor => <div>{donor.name}</div>);
}));

jest.mock('./hooks', () => ({
  useFetchDonors: jest.fn().mockReturnValue({
    fetchDonorsMutation: jest.fn(),
    isLoading: false,
  }),
}));

const defaultProps = {
  name: 'donors',
  donorOrganizationIds: [],
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
      fetchDonorsMutation: jest.fn(),
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeDefined();
  });

  it('should render Loading component', () => {
    useFetchDonors.mockClear().mockReturnValue({
      fetchDonorsMutation: jest.fn(),
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('should call `fetchDonorsMutation` with `donorOrganizationIds`', () => {
    const mockData = [{ name: 'Amazon', code: 'AMAZ', id: '1' }];
    const fetchDonorsMutationMock = jest.fn().mockReturnValue({
      then: (cb) => cb(mockData),
    });

    useFetchDonors.mockClear().mockReturnValue({
      fetchDonorsMutation: fetchDonorsMutationMock,
      isLoading: false,
    });

    renderComponent({ donorOrganizationIds: ['1'] });

    expect(fetchDonorsMutationMock).toHaveBeenCalled();
    expect(screen.getByText(mockData[0].name)).toBeDefined();
  });
});
