import { noop } from 'lodash';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

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

    expect(getByText('ui-organizations.filterConfig.language')).toBeDefined();
  });

  it('should invoke onChange callback when something is selected', async () => {
    const onChangeFilter = jest.fn();
    const { findByText } = renderFilter(false, onChangeFilter);

    await user.click(screen.getByText('stripes-components.selection.controlLabel'));
    await user.click(await findByText('Zulu'));
    await waitFor(() => expect(onChangeFilter).toHaveBeenCalled());
  });
});
