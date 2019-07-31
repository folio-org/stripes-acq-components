import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { AutoSuggest } from '@folio/stripes/components';

const FieldAutoSuggest = ({ labelId, valueKey, ...rest }) => (
  <Field
    component={AutoSuggest}
    label={<FormattedMessage id={labelId} />}
    valueKey={valueKey}
    includeItem={(item, searchString) => item[valueKey].includes(searchString)}
    renderOption={item => (item ? item[valueKey] : '')}
    renderValue={item => (item ? item[valueKey] : '')}
    {...rest}
  />
);

FieldAutoSuggest.propTypes = {
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  valueKey: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
};

FieldAutoSuggest.defaultProps = {
  valueKey: 'value',
};

export default FieldAutoSuggest;
