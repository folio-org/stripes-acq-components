import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { FormattedMessage } from 'react-intl';

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
    expect(screen.queryByText('stripes-smart-components.sas.noResults.loading')).toBeNull();
  });

  it('should display passed data', () => {
    renderComponent();
    expect(screen.getByText('item 1')).toBeDefined();
    expect(screen.queryByTestId('arrow-0')).toBeNull();
  });

  it('should display arrow', () => {
    renderComponent({ hasArrow: true });
    expect(screen.getByTestId('arrow-0')).toBeDefined();
  });

  it('should change sorting', () => {
    renderComponent();
    expect(screen.getAllByRole('columnheader', { id: 'list-column-name' })[0].getAttribute('aria-sort')).toBe('ascending');
    user.click(screen.getAllByRole('button', { id: 'clickable-list-column-name' })[0]);
    expect(screen.getAllByRole('columnheader', { id: 'list-column-name' })[0].getAttribute('aria-sort')).toBe('descending');
  });
});
