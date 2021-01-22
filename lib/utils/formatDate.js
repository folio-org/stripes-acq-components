import moment from 'moment';

import { DATE_FORMAT } from '../constants';

export const formatDate = (value) => {
  if (!value) return null;
  const momentDate = moment.utc(value);

  return momentDate.isValid() ? momentDate.format(DATE_FORMAT) : null;
};
