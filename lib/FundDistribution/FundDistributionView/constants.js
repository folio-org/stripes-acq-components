import { FormattedMessage } from 'react-intl';

export const FUND_DISTRIBUTION_VISIBLE_COLUMNS = [
  'name',
  'expenseClass',
  'value',
  'amount',
  'initialEncumbrance',
  'currentEncumbrance',
];
export const FUND_DISTRIBUTION_COLUMN_MAPPING = {
  'adjustmentDescription': <FormattedMessage id="stripes-acq-components.fundDistribution.adjustmentDescription" />,
  'name': <FormattedMessage id="stripes-acq-components.fundDistribution.name" />,
  'value': <FormattedMessage id="stripes-acq-components.fundDistribution.value" />,
  'amount': <FormattedMessage id="stripes-acq-components.fundDistribution.amount" />,
  'initialEncumbrance': <FormattedMessage id="stripes-acq-components.fundDistribution.initialEncumbrance" />,
  'currentEncumbrance': <FormattedMessage id="stripes-acq-components.fundDistribution.currentEncumbrance" />,
  'expenseClass': <FormattedMessage id="stripes-acq-components.fundDistribution.expenseClass" />,
};
