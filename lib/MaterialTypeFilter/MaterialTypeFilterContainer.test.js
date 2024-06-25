import {
  render,
  screen,
} from '@testing-library/react';
import user from '@testing-library/user-event';

import { useMaterialTypes } from '../hooks';
import MaterialTypeFilterContainer from './MaterialTypeFilterContainer';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useMaterialTypes: jest.fn(),
}));

const M_TYPES = [{ id: '1', name: 'type 1' }];

const defaultProps = {
  id: 'material-filter',
  name: 'material-filter',
  labelId: 'material.filter',
  onChange: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <MaterialTypeFilterContainer
    {...defaultProps}
    {...props}
  />,
);

describe('MaterialTypeFilterContainer', () => {
  beforeEach(() => {
    useMaterialTypes
      .mockClear()
      .mockReturnValue({ materialTypes: M_TYPES });
  });

  it('should display MaterialTypeFilter', async () => {
    renderComponent();

    expect(screen.getByText('material.filter')).toBeInTheDocument();
  });

  it('should call onChange', async () => {
    renderComponent({ activeFilter: '1' });

    await user.click(screen.getByText('type 1'));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});
