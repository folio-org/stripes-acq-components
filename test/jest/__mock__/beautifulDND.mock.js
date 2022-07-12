jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    provided: {
      innerRef: jest.fn(),
      isDragging: false,
      draggableProps: {
        style: {},
      },
      dragHandleProps: {},
    },
    snapshot: { isDragging: false },
  }, {}),
  DragDropContext: ({ children }) => children,
}));
