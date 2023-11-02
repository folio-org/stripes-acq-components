import { FormattedMessage } from 'react-intl';

export const columnMapping = {
  name: <FormattedMessage id="stripes-acq-components.donors.column.name" />,
  code: <FormattedMessage id="stripes-acq-components.donors.column.code" />,
  unassignDonor: null,
};

export const visibleColumns = [
  'name',
  'code',
  'unassignDonor',
];

export const alignRowProps = { alignLastColToEnd: true };

export const columnWidths = {
  name: '45%',
  code: '45%',
  unassignDonor: '10%',
};

export const modalLabel = <FormattedMessage id="stripes-acq-components.donors.modal.title" />;
export const resultsPaneTitle = <FormattedMessage id="stripes-acq-components.donors.modal.resultsTitle" />;

export const pluginVisibleColumns = ['name', 'code'];

export const DONORS_SORT_MAP = {
  name: 'name',
  code: 'code',
};

const ORGANIZATION_STATUS = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

const FILTERS = {
  IS_VENDOR: 'isVendor',
  STATUS: 'status',
  TAGS: 'tags',
  TYPES: 'organizationTypes',
};

export const visibleFilters = [
  FILTERS.IS_VENDOR,
  FILTERS.TAGS,
  FILTERS.TYPES,
];

export const initialFilters = {
  [FILTERS.IS_DONOR]: ['true'],
  [FILTERS.STATUS]: [ORGANIZATION_STATUS.active],
};

export const searchableIndexes = pluginVisibleColumns.map(column => ({
  labelId: `ui-organizations.search.${column}`,
  value: column,
}));
