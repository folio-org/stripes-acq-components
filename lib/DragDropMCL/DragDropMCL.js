import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
} from 'react-beautiful-dnd';

import { MultiColumnList } from '@folio/stripes/components';

import {
  defaultColumnMapping,
  defaultColumnWidths,
  defaultFormatter,
} from './constants';
import { DraggableRowFormatter } from './DraggableRowFormatter';

import css from './DragDropMCL.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

const DEFAULT_COLUMN_WIDTHS = {};
const DEFAULT_ROW_PROPS = {};
const returnTrue = () => true;

export const DragDropMCL = ({
  columnMapping,
  columnWidths = DEFAULT_COLUMN_WIDTHS,
  contentData,
  formatter,
  id,
  isRowDraggable = returnTrue,
  onDragEnd,
  onUpdate = noop,
  rowFormatter = DraggableRowFormatter,
  rowProps = DEFAULT_ROW_PROPS,
  visibleColumns,
  ...props
}) => {
  const onDragEndDefault = useCallback(({
    destination,
    source,
  }) => {
    const isNotChanged = !destination || destination.index === source.index;

    if (isNotChanged) return null;

    const updatedSequence = reorder(
      contentData,
      source.index,
      destination.index,
    );

    return onUpdate(updatedSequence);
  }, [contentData, onUpdate]);

  return (
    <DragDropContext onDragEnd={onDragEnd || onDragEndDefault}>
      <Droppable droppableId={`droppable-${id}`}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <MultiColumnList
              columnMapping={{ ...defaultColumnMapping, ...columnMapping }}
              columnWidths={{ ...defaultColumnWidths, ...columnWidths }}
              contentData={contentData}
              formatter={{ ...defaultFormatter, ...formatter }}
              getRowContainerClass={defaultClass => `${defaultClass} ${css.mclRowContainer}`}
              id={id}
              rowFormatter={rowFormatter}
              rowProps={{
                ...rowProps,
                isRowDraggable,
              }}
              visibleColumns={['draggable', ...visibleColumns]}
              dndProvided={provided}
              {...props}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

DragDropMCL.propTypes = {
  columnMapping: PropTypes.object.isRequired,
  columnWidths: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  formatter: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  isRowDraggable: PropTypes.func,
  onDragEnd: PropTypes.func,
  onUpdate: PropTypes.func,
  rowFormatter: PropTypes.func,
  rowProps: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
