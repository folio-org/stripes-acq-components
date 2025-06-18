import noop from 'lodash/noop';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText('ui-organizations.filterConfig.country')).toBeInTheDocument();
  });

  it('should invoke onChange callback when something is selected', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByText } = renderFilter(false, onChangeFilter);
    const button = container.querySelector('[id="org-filter-country-selection"]');

    await userEvent.click(button);

    const afgOption = getByText('AF');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    await userEvent.click(afgOption);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
