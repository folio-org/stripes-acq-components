import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { PrivilegedDonorContactsList } from './PrivilegedDonorContactsList';

jest.mock('./hooks', () => ({
  useCategories: jest.fn().mockReturnValue({
    categories: [],
    isLoading: false,
  }),
}));

const defaultProps = {
  contentData: [],
  id: 'donors',
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => (render(
  <PrivilegedDonorContactsList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('PrivilegedDonorContactsList', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeDefined();
  });

  it('should render the list of donor contacts', () => {
    renderComponent({
      contentData: [
        { id: '1', firstName: 'John', lastName: 'Smith' },
        { id: '2', firstName: 'Tim', lastName: 'Jones' },
      ],
    });

    expect(screen.getByText('Jones, Tim')).toBeDefined();
    expect(screen.getByText('Smith, John')).toBeDefined();
  });
});
