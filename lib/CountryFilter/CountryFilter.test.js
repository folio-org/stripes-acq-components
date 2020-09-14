import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { noop } from 'lodash';

import '../../test/jest/__mock__';

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

  it('should invoke onChange callback when something is selected', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByText } = renderFilter(false, onChangeFilter);
    const afgOption = getByText('stripes-acq-components.data.countries.AFG');
    const button = container.querySelector('[id="org-filter-country-selection"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);
    fireEvent.click(afgOption);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
