export const getAcqUnitsOptions = (acqUnits) => {
  return Array.isArray(acqUnits)
    ? acqUnits.map(acqUnit => ({
      value: acqUnit.id,
      label: acqUnit.name,
    }))
    : [];
};
