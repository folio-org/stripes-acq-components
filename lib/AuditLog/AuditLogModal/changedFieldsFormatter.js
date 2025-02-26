import { map } from 'lodash';

import {
  List,
  NoValue,
} from '@folio/stripes/components';

const changedFieldsFormatter = ({
  fieldValue,
  fieldName,
  listItemFormatter,
  fieldFormatter,
}) => {
  if (!fieldValue) return <NoValue />;

  if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
    return (
      <List
        items={map(fieldValue, (value, name) => ({ name, value }))}
        itemFormatter={listItemFormatter}
        listStyle="bullets"
        marginBottom0
      />
    );
  }

  return fieldFormatter?.[fieldName]?.(fieldValue) || fieldValue;
};

export default changedFieldsFormatter;
