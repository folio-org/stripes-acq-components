import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

import { DraggableRow } from '../DraggableRow';

export const DraggableRowFormatter = ({
  rowIndex,
  rowData,
  rowProps,
  ...props
}) => {
  return (
    <Draggable
      key={`row-${rowIndex}`}
      draggableId={`draggable-${rowIndex}`}
      index={rowIndex}
      isDragDisabled={rowProps.isRowDraggable && !rowProps.isRowDraggable(rowData, rowIndex)}
    >
      {(provided, snapshot) => (
        <DraggableRow
          provided={provided}
          rowData={rowData}
          rowIndex={rowIndex}
          rowProps={rowProps}
          snapshot={snapshot}
          {...props}
        />
      )}
    </Draggable>
  );
};

DraggableRowFormatter.propTypes = {
  rowIndex: PropTypes.number,
  rowData: PropTypes.object,
  rowProps: PropTypes.shape({
    isRowDraggable: PropTypes.func,
  }),
};
