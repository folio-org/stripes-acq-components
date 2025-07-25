import {
  MemoryRouter,
  Route,
} from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import FundDistributionView from './FundDistributionView';

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <Route
      render={() => (
        <FundDistributionView
          amounts={{}}
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
  it('should display list with fund distribution', () => {
    const fundsToDisplay = [{ fundId: 'fund1', fundName: 'fund 1' }];

    renderComponent({ fundsToDisplay });

    expect(screen.getByText('fund 1')).toBeInTheDocument();
  });

  it('should display unavailable fund if no name provided', () => {
    const fundsToDisplay = [{ fundCode: 'fund1' }];

    renderComponent({ fundsToDisplay });

    expect(screen.getByText('stripes-acq-components.fundDistribution.unavailableFund')).toBeInTheDocument();
  });

  it('should display \'Current encumbrance\' value as a link', () => {
    const fundsToDisplay = [{
      fundCode: 'fund1',
      fundBudget: {
        id: 'budget-id',
      },
      fundEncumbrance: {
        id: 'encumbrance-id',
        amount: 777,
      },
    }];

    renderComponent({ fundsToDisplay });

    expect(screen.getByText(`$${fundsToDisplay[0].fundEncumbrance.amount.toFixed(2)}`).tagName).toBe('A');
  });
});
