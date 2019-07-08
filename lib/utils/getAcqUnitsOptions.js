// eslint-disable-next-line import/prefer-default-export
export const getAcqUnitsOptions = (acqUnits = []) => acqUnits.map(acqUnit => ({
  value: acqUnit.id,
  label: acqUnit.name,
}));
