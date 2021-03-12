import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import MaterialTypeFilterContainer from './MaterialTypeFilterContainer';

const M_TYPES = [{ id: '1', name: 'type 1' }];

const renderComponent = (props = {}) => (render(
  <MaterialTypeFilterContainer
    onChange={() => { }}
    labelId="material.filter"
    name="material-filter"
    id="material-filter"
    {...props}
  />,
));

describe('MaterialTypeFilterContainer', () => {
  it('should display MaterialTypeFilter', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('material.filter')).toBeDefined());
  });

  // TODO check out what is wrong with async data fetch
  xit('should call onChange', async () => {
    const mutator = {
      materialTypeFilterMaterials: {
        GET: jest.fn().mockResolvedValue(M_TYPES),
        reset: jest.fn(),
      },
    };
    const onChange = jest.fn();

    renderComponent({ mutator, activeFilter: '1', onChange });
    await waitFor(() => user.click(screen.getByText('type 1')));

    expect(onChange).toHaveBeenCalledWith({});
  });
});
