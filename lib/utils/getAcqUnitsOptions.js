export const getAcqUnitsOptions = (resources) => {
  const acqUnits = resources?.acqUnits?.records || [];

  return acqUnits.map(acqUnit => ({
    value: acqUnit.id,
    label: acqUnit.name,
  }));
};
