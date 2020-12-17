import React from 'react';
import { render, cleanup } from '@testing-library/react';

import PluggableUserFilter from './PluggableUserFilter';

const userFilterLabel = 'ui-orders.orderDetails.assignedTo';

const renderUserFilter = () => (render(
  <PluggableUserFilter
    id="assignTo"
    activeFilters={[]}
    labelId={userFilterLabel}
    name="assignToFilter"
    onChange={() => {}}
  />,
));

describe('Given PluggableUserFilter component', () => {
  afterEach(cleanup);

  it('Than it should display passed title', () => {
    const { getByText } = renderUserFilter();

    expect(getByText(userFilterLabel)).toBeDefined();
  });
});
