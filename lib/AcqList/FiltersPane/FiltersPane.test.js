import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import FiltersPane from './FiltersPane';

const FILTERS = 'Filters';
const COLLAPSE_FILTERS_BUTTON = 'Icon';

const renderFiltersPane = (props = {
  toggleFilters: jest.fn(),
}) => (render(
  <FiltersPane
    {...props}
  >
    {FILTERS}
  </FiltersPane>,
));

describe('FiltersPane', () => {
  it('should display passed children', () => {
    const { getByText } = renderFiltersPane();

    expect(getByText(FILTERS)).toBeDefined();
  });

  it('should call toggleFilters when collapse filters button is pressed', async () => {
    const toggleFilters = jest.fn();
    const { getByText } = renderFiltersPane({ toggleFilters });

    await userEvent.click(getByText(COLLAPSE_FILTERS_BUTTON));

    expect(toggleFilters).toHaveBeenCalled();
  });
});
