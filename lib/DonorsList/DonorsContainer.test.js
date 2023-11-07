import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import stripesFinalForm from '@folio/stripes/final-form';

import DonorsContainer from './DonorsContainer';
import { useFetchDonors } from './hooks';

jest.mock('./DonorsList', () => jest.fn(({ contentData }) => {
  if (!contentData.length) {
    return 'stripes-components.tableEmpty';
  }

  return contentData.map(({ name }) => <div key={name}>{name}</div>);
}));

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
  donorsMap: {
    1: { id: '1', name: 'Amazon' },
    2: { id: '2', name: 'Google' },
  },
  formatter: jest.fn(),
  id: 'donors',
  setDonorIds: jest.fn(),
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

    expect(screen.getByText('stripes-acq-components.donors.noFindOrganizationPlugin')).toBeDefined();
  });

  it('should call `useFetchDonors` with `donorOrganizationIds`', () => {
    const mockData = [{ name: 'Amazon', code: 'AMAZ', id: '1' }];

    renderComponent({ donors: mockData });

    expect(screen.getByText(mockData[0].name)).toBeDefined();
  });
});
