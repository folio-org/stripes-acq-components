import noop from 'lodash/noop';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText('ui-organizations.filterConfig.language')).toBeInTheDocument();
  });

  it('should invoke onChange callback when something is selected', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByText } = renderFilter(false, onChangeFilter);
    const button = container.querySelector('[id="org-filter-language-selection"]');

    await userEvent.click(button);

    const option = getByText('Abkhazian');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    await userEvent.click(option);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
