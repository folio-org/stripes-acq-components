import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ContributorDetails from './ContributorDetails';

const CONTRIBUTOR_NAME_TYPES = [{ id: '1', name: 'contr 1' }];
const CONTRIBUTORS = [{ contributorNameTypeId: '1' }];

const renderComponent = (props = {}) => (render(
  <ContributorDetails
    {...props}
  />,
));

describe('ContributorDetails', () => {
  it('should display empty list', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeInTheDocument();
  });

  it('should display empty list with empty array', () => {
    renderComponent({ contributors: [] });

    expect(screen.getByText('stripes-components.tableEmpty')).toBeInTheDocument();
  });

  it('should display not empty list with some values', () => {
    renderComponent({ contributors: CONTRIBUTORS });

    expect(screen.queryByText('stripes-components.tableEmpty')).not.toBeInTheDocument();
  });

  it('should display list with proper value', () => {
    renderComponent({
      contributors: CONTRIBUTORS,
      contributorNameTypes: CONTRIBUTOR_NAME_TYPES,
    });

    expect(screen.getByText('contr 1')).toBeInTheDocument();
  });
});
