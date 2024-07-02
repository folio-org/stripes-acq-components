import {
  render,
  screen,
  within,
} from '@testing-library/react';

import { useLocationsQuery } from '../hooks';
import LocationFilterContainer from './LocationFilterContainer';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useLocationsQuery: jest.fn(),
}));

const locations = [{ id: '1', name: 'location 1' }];

const defaultProps = {
  onChange: jest.fn(),
  labelId: 'location.filter',
  name: 'location-filter',
};

const renderComponent = (props = {}) => render(
  <LocationFilterContainer
    {...defaultProps}
    {...props}
  />,
);

describe('LocationFilterContainer', () => {
  beforeEach(() => {
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations });
  });

  it('should display location filter', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.labelId)).toBeInTheDocument();
  });

  it('should pass preselected filter', async () => {
    const { container } = renderComponent({ activeFilter: [locations[0].id] });

    expect(
      within(container.querySelector('.multiSelectValueList')).getByText(locations[0].name),
    ).toBeInTheDocument();
  });

  describe('ECS mode', () => {
    it('should pass preselected filter', async () => {
      const { container } = renderComponent({
        activeFilter: [locations[0].id],
        crossTenant: true,
      });

      expect(
        within(container.querySelector('.multiSelectValueList')).getByText(locations[0].name),
      ).toBeInTheDocument();
    });
  });
});
