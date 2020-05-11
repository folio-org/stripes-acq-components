export const getAcqUnitsOptions = (acqUnits = []) => {
  return acqUnits.map(acqUnit => ({
    value: acqUnit.id,
    label: acqUnit.name,
  }));
};
