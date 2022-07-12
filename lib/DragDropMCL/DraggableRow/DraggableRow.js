import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import className from 'classnames';

export const DraggableRow = ({
  snapshot,
  provided,
  rowClass,
  rowIndex,
  cells,
}) => {
  const usePortal = snapshot.isDragging;

  const Row = (
    <div
      data-testid="draggable-row"
      ref={provided.innerRef}
      key={`draggable-row-${rowIndex}`}
      className={className(rowClass)}
      id={`draggable-row-${rowIndex}`}
      role="row"
      tabIndex="0"
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {cells}
    </div>
  );

  if (!usePortal) {
    return Row;
  }

  const container = document.getElementById('OverlayContainer');

  return ReactDOM.createPortal(Row, container);
};

DraggableRow.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.element),
  provided: PropTypes.object,
  snapshot: PropTypes.object,
  rowClass: PropTypes.string,
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
  rowProps: PropTypes.object,
};
