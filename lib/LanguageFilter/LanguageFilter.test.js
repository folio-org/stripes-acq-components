import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';

import translations from '../../translations/stripes-acq-components/en';
import prefixKeys from '../../test/bigtest/helpers/prefixKeys';
import '../../test/jest/__mock__';

import LanguageFilter from './LanguageFilter';

const messages = {
  'stripes-components.selection.filterOptionsPlaceholder': 'filterOptionsPlaceholder',
  'stripes-components.selection.filterOptionsLabel': 'filterOptionsLabel',
  'ui-organizations.filterConfig.language': 'language',
  ...prefixKeys(translations, 'stripes-acq-components'),
};

const FILTER_NAME = 'org-filter-language';

const renderFilter = (disabled = false, onChange = noop) => (render(
  <IntlProvider locale="en" messages={messages}>
    <LanguageFilter
      disabled={disabled}
      id={FILTER_NAME}
      labelId="ui-organizations.filterConfig.language"
      name={FILTER_NAME}
      onChange={onChange}
    />
  </IntlProvider>,
));

describe('LanguageFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByLabelText } = renderFilter();

    expect(getByLabelText('language filter list')).toBeDefined();
  });

  it('should invoke onChange callback when something is selected', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByText } = renderFilter(false, onChangeFilter);
    const option = getByText('Afar');
    const button = container.querySelector('[id="org-filter-language-selection"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);
    fireEvent.click(option);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
