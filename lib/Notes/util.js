export const getReferredEntityData = (state) => {
  return state
    ? {
      name: state.entityName,
      type: state.entityType,
      id: state.entityId,
    }
    : null;
};
