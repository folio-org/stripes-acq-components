import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectFilter from './SelectFilter';

const mockOnChange = jest.fn();

const defaultProps = {
  id: 'test-filter',
  activeFilters: ['value1'],
  labelId: 'test-label',
  name: 'test-name',
  onChange: mockOnChange,
  options: [
    { label: 'Option 1', value: 'value1' },
    { label: 'Option 2', value: 'value2' },
  ],
};

const renderSelectFilter = (props = {}) => render(
  <SelectFilter
    {...defaultProps}
    {...props}
  />,
);

describe('SelectFilter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the filter accordion', () => {
    renderSelectFilter();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should call onChange with the correct value when an option is selected', async () => {
    renderSelectFilter();

    await userEvent.selectOptions(screen.getByRole('combobox'), ['value2']);

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'test-name',
      values: ['value2'],
    });
  });

  it('should disable the select when the disabled prop is true', () => {
    renderSelectFilter({ disabled: true });

    const select = screen.getByRole('combobox');

    expect(select).toBeDisabled();
  });

  it('should render an empty option by default', () => {
    renderSelectFilter();

    const select = screen.getByRole('combobox');

    expect(select).toHaveValue('value1');
  });

  it('should render nothing if options are not provided', () => {
    renderSelectFilter({ options: null });

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
