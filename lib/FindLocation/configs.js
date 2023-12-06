import { FormattedMessage } from 'react-intl';

export const COLUMN_NAMES = {
  name: 'name',
  code: 'code',
  institution: 'institution',
  campus: 'campus',
  library: 'library',
  isActive: 'isActive',
  isAssigned: 'isAssigned',
};

export const COLUMN_MAPPING = {
  [COLUMN_NAMES.name]: <FormattedMessage id="stripes-acq-components.find-location.results.column.name" />,
  [COLUMN_NAMES.code]: <FormattedMessage id="stripes-acq-components.find-location.results.column.code" />,
  [COLUMN_NAMES.institution]: <FormattedMessage id="stripes-acq-components.find-location.results.column.institution" />,
  [COLUMN_NAMES.campus]: <FormattedMessage id="stripes-acq-components.find-location.results.column.campus" />,
  [COLUMN_NAMES.library]: <FormattedMessage id="stripes-acq-components.find-location.results.column.library" />,
  [COLUMN_NAMES.isActive]: <FormattedMessage id="stripes-acq-components.find-location.results.column.status" />,
};

export const SORTABLE_COLUMNS = [
  COLUMN_NAMES.name,
  COLUMN_NAMES.code,
  COLUMN_NAMES.isActive,
];

export const NON_TOGGLEABLE_COLUMNS = [
  COLUMN_NAMES.name,
];

export const FILTERS = {
  institutions: 'institutions',
  campuses: 'campuses',
  libraries: 'libraries',
  isAssigned: 'isAssigned',
};

export const ASSIGNED_FILTER_OPTIONS = [
  {
    value: true,
    label: <FormattedMessage id="stripes-acq-components.filter.assignment.assigned" />,
  },
  {
    value: false,
    label: <FormattedMessage id="stripes-acq-components.filter.assignment.unassigned" />,
  },
];
