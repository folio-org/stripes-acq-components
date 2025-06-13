import { FormattedMessage } from 'react-intl';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { mockOffsetSize } from '../../test/jest/helpers/mockOffsetSize';
import FrontendSortingMCL from './FrontendSortingMCL';

const contentData = [{ id: '1', name: 'item 1', allocated: 233.33 }];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.item.name" />,
  allocated: <FormattedMessage id="ui-finance.item.allocated" />,
};

const sorters = {
  name: ({ name }) => name?.toLowerCase(),
  allocated: ({ allocated }) => allocated,
};

const visibleColumns = ['name', 'allocated'];

const renderComponent = (props) => render(
  <FrontendSortingMCL
    columnMapping={columnMapping}
    contentData={contentData}
    hasArrow={false}
    sortedColumn="name"
    sorters={sorters}
    visibleColumns={visibleColumns}
    {...props}
  />,
);

describe('FrontendSortingMCL', () => {
  mockOffsetSize(500, 500);

  it('should not display anything if contentData is null or undefined', () => {
    renderComponent({ contentData: null });
    expect(screen.queryByText('stripes-smart-components.sas.noResults.loading')).not.toBeInTheDocument();
  });

  it('should display passed data', () => {
    renderComponent();
    expect(screen.getByText('item 1')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-0')).not.toBeInTheDocument();
  });

  it('should display arrow', () => {
    renderComponent({ hasArrow: true });
    expect(screen.getByTestId('arrow-0')).toBeInTheDocument();
  });

  it('should change sorting', async () => {
    renderComponent();

    expect(screen.getAllByRole('columnheader', { id: 'list-column-name' })[0].getAttribute('aria-sort')).toBe('ascending');

    await userEvent.click(screen.getAllByRole('button', { id: 'clickable-list-column-name' })[0]);

    expect(screen.getAllByRole('columnheader', { id: 'list-column-name' })[0].getAttribute('aria-sort')).toBe('descending');
  });
});
