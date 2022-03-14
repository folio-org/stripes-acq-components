import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';

import FundFilter from './FundFilter';

const fundRecords = [
  { id: '001', code: 'Fund #1' },
  { id: '002', code: 'Fund #2' },
  { id: '003', code: 'Fund #3' },
];

const messages = {
  'stripes-components.selection.filterOptionsPlaceholder': 'Placeholder',
  'stripes-components.selection.filterOptionsLabel': 'Label',
  'stripes-components.selection.emptyList': 'The list is empty',
  'stripes-components.selection.noMatches': 'No any matches',
};

const filterAccordionTitle = 'stripes-acq-components.filter.fundCode';

const renderFundFilter = (funds) => (render(
  <IntlProvider locale="en" messages={messages}>
    <FundFilter
      id="fund"
      activeFilters={[]}
      name="fund"
      onChange={noop}
      labelId={filterAccordionTitle}
      funds={funds}
    />
  </IntlProvider>,
));

describe('FundFilter component', () => {
  it('should display passed title', () => {
    const { getByText } = renderFundFilter();

    expect(getByText(filterAccordionTitle)).toBeDefined();
  });

  it('should be closed by default', () => {
    const { getByLabelText } = renderFundFilter();

    expect(getByLabelText('stripes-acq-components.filter.fundCode filter list').getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should render all passed options', async () => {
    const { findAllByText } = renderFundFilter(fundRecords);

    const renderedFilterOptions = await findAllByText(/Fund #[0-9]/);

    expect(renderedFilterOptions.length).toBe(fundRecords.length);
  });
});
