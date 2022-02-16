import React from 'react';
import { render, screen } from '@testing-library/react';

import { FilterMenu } from './FilterMenu';

const defaultProps = {
  children: <>Filters</>,
  prefix: 'test',
};

const renderFilterMenu = (props = {}) => render(
  <FilterMenu
    {...defaultProps}
    {...props}
  />,
);

describe('FilterMenu', () => {
  it('should render filter menu section', () => {
    renderFilterMenu();

    expect(screen.getByText('stripes-acq-components.filter.placeholder')).toBeInTheDocument();
  });
});
