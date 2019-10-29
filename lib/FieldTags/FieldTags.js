import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find, get } from 'lodash';
import {
  change,
  getFormValues,
} from 'redux-form';

import { filterArrayValues } from '../utils';
import { FieldMultiSelection } from '../FieldMultiSelection';

const label = <FormattedMessage id="stripes-acq-components.label.tags" />;
const itemToString = item => item;

const renderTag = ({ filterValue, exactMatch }) => {
  if (exactMatch || !filterValue) {
    return null;
  } else {
    return (
      <FormattedMessage
        id="stripes-acq-components.addTagFor"
        values={{ filterValue }}
      />
    );
  }
};

const FieldTags = ({
  allTags,
  formName,
  name,
  onAdd,
  store,
}) => {
  const addTag = useCallback(
    ({ inputValue }) => {
      const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
      const formValues = getFormValues(formName)(store.getState());
      const updatedTags = get(formValues, name, []).concat(tag).filter(Boolean);

      if (tag) {
        store.dispatch(change(formName, name, updatedTags));
        onAdd(tag);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formName, onAdd],
  );

  const addAction = { onSelect: addTag, render: renderTag };
  const actions = [addAction];

  const dataOptions = allTags.map(tag => tag.label.toLowerCase()).sort();

  const formatter = ({ option }) => {
    const item = find(allTags, { label: option }) || option;

    if (!item) return option;

    return item.label;
  };

  return (
    <FieldMultiSelection
      actions={actions}
      dataOptions={dataOptions}
      emptyMessage=" "
      filter={filterArrayValues}
      formatter={formatter}
      itemToString={itemToString}
      label={label}
      name={name}
    />
  );
};

FieldTags.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.object),
  formName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
};

FieldTags.defaultProps = {
  allTags: [],
};

export default FieldTags;
