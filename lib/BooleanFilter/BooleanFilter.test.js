import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import BooleanFilter from './BooleanFilter';

const renderBooleanFilter = (props = {}) => (render(
  <BooleanFilter
    id="bool-filter"
    labelId="bool-filter"
    name="bool-filter"
    {...props}
  />,
));

describe('BooleanFilter', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('should display Boolean filter', () => {
    renderBooleanFilter({ onChange });
    expect(screen.getByText('stripes-acq-components.filter.true')).toBeInTheDocument();
  });

  it('should call onChange', async () => {
    renderBooleanFilter({ onChange });

    await userEvent.click(screen.getByText('stripes-acq-components.filter.false'));

    expect(onChange).toHaveBeenCalledWith({ name: 'bool-filter', values: ['false'] });
  });
});
