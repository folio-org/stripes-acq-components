import { render, screen } from '@testing-library/react';

import MultiSelectionFilter from './MultiSelectionFilterContainer';

const label = 'filter-label';

const defaultProps = {
  id: 'acq-test-filter',
  activeFilters: [],
  label,
  name: 'filterName',
  onChange: jest.fn(),
  options: [
    { label: 'Option 1', value: 'val-1' },
    { label: 'Option 2', value: 'val-2' },
  ],
};

const renderMultiSelectionFilter = (props = {}) => render(
  <MultiSelectionFilter
    {...defaultProps}
    {...props}
  />,
);

describe('MultiSelectionFilter component', () => {
  it('should display passed title', () => {
    renderMultiSelectionFilter();

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('should display passed options', () => {
    renderMultiSelectionFilter();

    defaultProps.options.forEach(({ label: l }) => (
      expect(screen.getByText(l)).toBeInTheDocument()
    ));
  });
});
