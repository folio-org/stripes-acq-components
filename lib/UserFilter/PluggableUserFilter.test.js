import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '../../test/jest/__mock__';

import PluggableUserFilter from './PluggableUserFilter';

const userFilterLabel = 'ui-orders.orderDetails.assignedTo';

const renderUserFilter = () => (render(
  <IntlProvider locale="en">
    <PluggableUserFilter
      id="assignTo"
      activeFilters={[]}
      labelId={userFilterLabel}
      name="assignToFilter"
      onChange={() => {}}
    />
  </IntlProvider>,
));

describe('Given PluggableUserFilter component', () => {
  afterEach(cleanup);

  it('Than it should display passed title', () => {
    const { getByText } = renderUserFilter();

    expect(getByText(userFilterLabel)).toBeDefined();
  });
});
