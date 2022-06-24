import React from 'react';
import { render, screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { DraggableRowFormatter } from './DraggableRowFormatter';

const defaultProps = {
  rowData: {},
  rowIndex: 0,
  rowProps: {},
};

const renderDraggableRowFormatter = (props = {}) => render(
  <DraggableRowFormatter
    {...defaultProps}
    {...props}
  />,
);

describe('DraggableRowFormatter', () => {
  it('should render a draggable row', () => {
    renderDraggableRowFormatter();

    expect(screen.getByTestId('draggable-row')).toBeInTheDocument();
  });
});
