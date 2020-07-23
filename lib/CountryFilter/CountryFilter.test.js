import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';

import translations from '../../translations/stripes-acq-components/en';
import prefixKeys from '../../test/bigtest/helpers/prefixKeys';
import '../../test/jest/__mock__';

import CountryFilter from './CountryFilter';

const messages = {
  'stripes-components.selection.filterOptionsPlaceholder': 'filterOptionsPlaceholder',
  'stripes-components.selection.filterOptionsLabel': 'filterOptionsLabel',
  'ui-organizations.filterConfig.country': 'country',
  ...prefixKeys(translations, 'stripes-acq-components'),
};

const FILTER_NAME = 'org-filter-country';

const renderFilter = (disabled = false, onChange = noop) => (render(
  <IntlProvider locale="en" messages={messages}>
    <CountryFilter
      disabled={disabled}
      id="org-filter-country"
      labelId="ui-organizations.filterConfig.country"
      name={FILTER_NAME}
      onChange={onChange}
    />
  </IntlProvider>,
));

describe('CountryFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByLabelText } = renderFilter();

    expect(getByLabelText('country filter list')).toBeDefined();
  });

  it('should invoke onChange callback when something is selected', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByText } = renderFilter(false, onChangeFilter);
    const afgOption = getByText('Afghanistan');
    const button = container.querySelector('[id="org-filter-country-selection"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);
    fireEvent.click(afgOption);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
