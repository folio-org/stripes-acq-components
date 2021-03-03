import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

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
    expect(screen.getByText('stripes-acq-components.filter.true')).toBeDefined();
  });

  it('should call onChange', () => {
    renderBooleanFilter({ onChange });
    user.click(screen.getByText('stripes-acq-components.filter.false'));
    expect(onChange).toHaveBeenCalledWith({ name: 'bool-filter', values: ['false'] });
  });
});
