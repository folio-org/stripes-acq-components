import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { AutoSuggest } from '@folio/stripes/components';

export const includeItem = (item, valueKey, searchString) => !!item?.[valueKey]?.includes(searchString);

const FieldAutoSuggest = ({ fieldComponent, labelId, valueKey, ...rest }) => {
  const FieldComponent = fieldComponent || Field;

  return (
    <FieldComponent
      component={AutoSuggest}
      label={<FormattedMessage id={labelId} />}
      valueKey={valueKey}
      includeItem={includeItem}
      renderOption={item => (item ? item[valueKey] : '')}
      renderValue={item => (item ? item[valueKey] : '')}
      {...rest}
    />
  );
};

FieldAutoSuggest.propTypes = {
  fieldComponent: PropTypes.elementType,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  valueKey: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
};

FieldAutoSuggest.defaultProps = {
  valueKey: 'value',
};

export default FieldAutoSuggest;
