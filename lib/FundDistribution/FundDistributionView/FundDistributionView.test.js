import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

import FundDistributionView from './FundDistributionView';

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <Route
      render={() => (
        <FundDistributionView
          expenseClasses={[]}
          currency="EUR"
          totalAmount={0}
          {...props}
        />
      )}
    />
  </MemoryRouter>,
));

describe('FundDistributionView', () => {
  it('should display ist with fund distribution', () => {
    const fundsToDisplay = [{ fundId: 'fund1', fundName: 'fund 1' }];

    renderComponent({ fundsToDisplay });
    expect(screen.getByText('fund 1')).toBeDefined();
  });

  it('should display unavailable fund if no name provided', () => {
    const fundsToDisplay = [{ fundCode: 'fund1' }];

    renderComponent({ fundsToDisplay });
    expect(screen.getByText('stripes-acq-components.fundDistribution.unavailableFund')).toBeDefined();
  });
});
