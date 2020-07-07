import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find, get } from 'lodash';

import { filterArrayValues } from '../utils';
import { FieldMultiSelectionFinal } from '../FieldMultiSelection';

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

const FieldTagsFinal = ({
  allTags,
  change,
  formValues,
  name,
  onAdd,
}) => {
  const addTag = useCallback(
    ({ inputValue }) => {
      const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
      const updatedTags = get(formValues, name, []).concat(tag).filter(Boolean);

      if (tag) {
        change(name, updatedTags);
        onAdd(tag);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [change, name, onAdd],
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
    <FieldMultiSelectionFinal
      actions={actions}
      dataOptions={dataOptions}
      emptyMessage=" "
      filter={filterArrayValues}
      formatter={formatter}
      itemToString={itemToString}
      label={label}
      name={name}
      validateFields={[]}
    />
  );
};

FieldTagsFinal.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.object),
  change: PropTypes.func.isRequired,
  formValues: PropTypes.object,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

FieldTagsFinal.defaultProps = {
  allTags: [],
};

export default FieldTagsFinal;
