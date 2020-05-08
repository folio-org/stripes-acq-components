export const getAcqUnitsOptions = (acqUnitsResource) => {
  const acqUnits = acqUnitsResource?.records || [];

  return acqUnits.map(acqUnit => ({
    value: acqUnit.id,
    label: acqUnit.name,
  }));
};
