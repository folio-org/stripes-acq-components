import { createRef } from 'react';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { DraggableRow } from './DraggableRow';

const defaultProps = {
  snapshot: { isDragging: false },
  provided: { innerRef: createRef() },
  rowClass: 'className',
  rowIndex: 0,
  cells: [],
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <div id="OverlayContainer">
    {children}
  </div>
);

const renderDraggableRow = (props = {}) => render(
  <DraggableRow
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('DraggableRow', () => {
  it('should render a row element', () => {
    renderDraggableRow();

    expect(screen.getByTestId('draggable-row')).toBeInTheDocument();
  });
});
