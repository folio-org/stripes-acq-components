import { FormattedMessage } from "react-intl";

export const COLUMN_NAMES = {
  name: 'name',
  // TODO: refine
  code: 'code',
  isActive: 'isActive',
  isAssigned: 'isAssigned',
};

export const COLUMN_MAPPING = {
  [COLUMN_NAMES.name]: <FormattedMessage id="stripes-acq-components.find-location.results.column.name" />,
  // TODO: refine
  [COLUMN_NAMES.code]: <FormattedMessage id="code" />,
  [COLUMN_NAMES.isActive]: <FormattedMessage id="stripes-acq-components.find-location.results.column.status" />,
  [COLUMN_NAMES.isAssigned]: <FormattedMessage id="stripes-acq-components.find-location.results.column.assignment" />,
};

export const VISIBLE_COLUMNS = Object.values(COLUMN_NAMES);
export const SORTABLE_COLUMNS = Object.values(COLUMN_NAMES);

export const FILTERS = {
  institutions: 'institutions',
  libraries: 'libraries',
  campuses: 'campuses',
};
