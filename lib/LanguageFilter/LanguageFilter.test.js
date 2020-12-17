import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { noop } from 'lodash';

import LanguageFilter from './LanguageFilter';

const FILTER_NAME = 'org-filter-language';

const renderFilter = (disabled = false, onChange = noop) => (render(
  <LanguageFilter
    disabled={disabled}
    id={FILTER_NAME}
    labelId="ui-organizations.filterConfig.language"
    name={FILTER_NAME}
    onChange={onChange}
  />,
));

describe('LanguageFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText('ui-organizations.filterConfig.language')).toBeDefined();
  });

  it('should invoke onChange callback when something is selected', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByText } = renderFilter(false, onChangeFilter);
    const option = getByText('stripes-acq-components.data.languages.abk');
    const button = container.querySelector('[id="org-filter-language-selection"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);
    fireEvent.click(option);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
