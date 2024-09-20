import { noop } from 'lodash';
import { fireEvent, render, cleanup } from '@testing-library/react';

import CountryFilter from './CountryFilter';

const FILTER_NAME = 'org-filter-country';

const renderFilter = (disabled = false, onChange = noop) => (render(
  <CountryFilter
    disabled={disabled}
    id="org-filter-country"
    labelId="ui-organizations.filterConfig.country"
    name={FILTER_NAME}
    onChange={onChange}
  />,
));

describe('CountryFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText('ui-organizations.filterConfig.country')).toBeDefined();
  });

  it('should invoke onChange callback when something is selected', () => {
    const onChangeFilter = jest.fn();
    const { container, getByText } = renderFilter(false, onChangeFilter);
    const button = container.querySelector('[id="org-filter-country-selection"]');

    fireEvent.click(button);

    const afgOption = getByText('AF');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(afgOption);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
