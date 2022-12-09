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
    expect(getFieldLabels(intl, paths, labelsMap)).toEqual(expect.arrayContaining([
      ...Object.values(labelsMap),
      'nonMappedField',
    ]));
  });
});
