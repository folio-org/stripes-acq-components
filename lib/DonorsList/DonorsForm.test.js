import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import stripesFinalForm from '@folio/stripes/final-form';

import DonorsForm from './DonorsForm';
import { useFetchDonors } from './hooks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('./DonorsList', () => jest.fn(({ donorsMap }) => {
  if (!Object.values(donorsMap).length) {
    return 'stripes-components.tableEmpty';
  }

  return Object.values(donorsMap).map(({ name }) => <div key={name}>{name}</div>);
}));

jest.mock('./hooks', () => ({
  useFetchDonors: jest.fn().mockReturnValue({
    donors: [],
    isLoading: false,
  }),
}));

const defaultProps = {
  name: 'donors',
  donorOrganizationIds: [],
};

const renderForm = (props = {}) => (
  <form>
    <DonorsForm
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

describe('DonorsForm', () => {
  beforeEach(() => {
    useFetchDonors.mockClear().mockReturnValue({
      donors: [],
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeDefined();
  });

  it('should render Loading component', () => {
    useFetchDonors.mockClear().mockReturnValue({
      donors: [],
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('should call `useFetchDonors` with `donorOrganizationIds`', () => {
    const mockData = [{ name: 'Amazon', code: 'AMAZ', id: '1' }];

    useFetchDonors.mockClear().mockReturnValue({
      donors: mockData,
      isLoading: false,
    });

    renderComponent({ donorOrganizationIds: ['1'] });

    expect(screen.getByText(mockData[0].name)).toBeDefined();
  });
});
