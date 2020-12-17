import React from 'react';
import { render, cleanup } from '@testing-library/react';

import PluggableOrganizationFilter from './PluggableOrganizationFilter';

const labelId = 'ui-orders.orderDetails.assignedTo';

const renderFilter = () => (render(
  <PluggableOrganizationFilter
    id="vendor"
    activeFilters={[]}
    labelId={labelId}
    name="vendor"
    onChange={() => {}}
  />,
));

describe('Given PluggableOrganizationFilter component', () => {
  afterEach(cleanup);

  it('Than it should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText(labelId)).toBeDefined();
  });
});
