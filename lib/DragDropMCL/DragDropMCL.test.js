import { render, screen } from '@testing-library/react';

import { DragDropMCL } from './DragDropMCL';

const defaultProps = {
  columnMapping: { id: 'ID' },
  columnWidths: { id: '100px' },
  contentData: [
    { id: 'testId1' },
    { id: 'testId2' },
  ],
  formatter: { id: (item) => item.id },
  id: 'draggbleMCLId',
  isRowDraggable: jest.fn(() => true),
  onUpdate: jest.fn(),
  visibleColumns: ['id'],
};

const renderDragDropMCL = (props = {}) => render(
  <DragDropMCL
    {...defaultProps}
    {...props}
  />,
);

describe('DragDropMCL', () => {
  it('should render MCL with draggable rows', () => {
    renderDragDropMCL();

    expect(screen.getAllByTestId('draggable-row')).toHaveLength(2);
    expect(screen.getByText('testId1')).toBeInTheDocument();
  });
});
