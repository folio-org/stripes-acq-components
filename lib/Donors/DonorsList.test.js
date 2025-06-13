import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { DonorsList } from './DonorsList';

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
  <DonorsList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('DonorsList', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeInTheDocument();
  });

  it('should render the list of donor organizations', () => {
    renderComponent({
      contentData: [
        { id: '1', name: 'Amazon' },
        { id: '2', name: 'Google' },
      ],
    });

    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });
});
