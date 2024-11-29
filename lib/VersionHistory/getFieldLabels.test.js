import { getFieldLabels } from './getFieldLabels';

const labelsMap = {
  'fundDistribution': 'ui-orders.line.accordion.fund',
  'fundDistribution[\\d]': 'ui-orders.line.accordion.fund',
  'fundDistribution[\\d].fundId': 'stripes-acq-components.fundDistribution.name',
};

const paths = [
  'fundDistribution',
  'fundDistribution[0]',
  'fundDistribution[1].fundId',
  'nonMappedField',
];

const intl = { formatMessage: ({ id }) => id };

describe('getFieldLabels', () => {
  it('should use keys of labelsMap as regexp to parse labels of paths', () => {
    expect(getFieldLabels(intl, paths, labelsMap).changedFields).toEqual(expect.arrayContaining([
      ...Object.values(labelsMap),
    ]));
  });

  it('should not render hidden fields', () => {
    const hiddenFields = {
      donors: 'donors',
    };

    const pathsWithHiddenFields = [...paths, hiddenFields.donors];
    const result = getFieldLabels(intl, pathsWithHiddenFields, labelsMap, hiddenFields);

    expect(result.changedFields).toEqual(expect.arrayContaining([
      ...Object.values(labelsMap),
    ]));
  });

  it('should isSystemChange equal `true` if there are only systemChanges', () => {
    const systemUpdatedFields = ['fundDistribution'];

    const result = getFieldLabels(intl, paths, labelsMap, [], systemUpdatedFields);

    expect(result.isSystemChange).toBeTruthy();
  });
});
