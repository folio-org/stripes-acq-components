import { FormattedMessage } from 'react-intl';

export const FUND_DISTRIBUTION_COLUMNS = {
  adjustmentDescription: 'adjustmentDescription',
  amount: 'amount',
  currentEncumbrance: 'currentEncumbrance',
  expenseClass: 'expenseClass',
  initialEncumbrance: 'initialEncumbrance',
  name: 'name',
  value: 'value',
};

export const FUND_DISTRIBUTION_VISIBLE_COLUMNS = [
  FUND_DISTRIBUTION_COLUMNS.name,
  FUND_DISTRIBUTION_COLUMNS.expenseClass,
  FUND_DISTRIBUTION_COLUMNS.value,
  FUND_DISTRIBUTION_COLUMNS.amount,
  FUND_DISTRIBUTION_COLUMNS.initialEncumbrance,
  FUND_DISTRIBUTION_COLUMNS.currentEncumbrance,
];

export const FUND_DISTRIBUTION_FIELDS_MAPPINGS = {
  [FUND_DISTRIBUTION_COLUMNS.name]: 'code',
  [FUND_DISTRIBUTION_COLUMNS.value]: 'value',
  [FUND_DISTRIBUTION_COLUMNS.expenseClass]: 'expenseClassId',
};

export const FUND_DISTRIBUTION_COLUMN_MAPPING = {
  [FUND_DISTRIBUTION_COLUMNS.adjustmentDescription]: <FormattedMessage id="stripes-acq-components.fundDistribution.adjustmentDescription" />,
  [FUND_DISTRIBUTION_COLUMNS.name]: <FormattedMessage id="stripes-acq-components.fundDistribution.name" />,
  [FUND_DISTRIBUTION_COLUMNS.value]: <FormattedMessage id="stripes-acq-components.fundDistribution.value" />,
  [FUND_DISTRIBUTION_COLUMNS.amount]: <FormattedMessage id="stripes-acq-components.fundDistribution.amount" />,
  [FUND_DISTRIBUTION_COLUMNS.initialEncumbrance]: <FormattedMessage id="stripes-acq-components.fundDistribution.initialEncumbrance" />,
  [FUND_DISTRIBUTION_COLUMNS.currentEncumbrance]: <FormattedMessage id="stripes-acq-components.fundDistribution.currentEncumbrance" />,
  [FUND_DISTRIBUTION_COLUMNS.expenseClass]: <FormattedMessage id="stripes-acq-components.fundDistribution.expenseClass" />,
};
