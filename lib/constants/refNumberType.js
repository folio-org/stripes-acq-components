const REF_NUMBER_TYPE = {
  continuationRefNumber: 'Vendor continuation reference number',
  internalNumber: 'Vendor internal number',
  refNumber: 'Vendor order reference number',
  subscriptionRefNumber: 'Vendor subscription reference number',
  titleNumber: 'Vendor title number',
};

export const REF_NUMBER_TYPE_OPTIONS = Object.keys(REF_NUMBER_TYPE).map((key) => ({
  labelId: `stripes-acq-components.referenceNumbers.refNumberType.${key}`,
  value: REF_NUMBER_TYPE[key],
}));
