import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { useForm } from 'react-final-form';

import { FieldMultiSelectionFinal } from '../FieldMultiSelection';
import { filterArrayValues } from '../utils';

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
  formValues: formValuesProp,
  fullWidth,
  labelless = false,
  marginBottom0,
  name,
  onAdd,
  ...props
}) => {
  const { change, getState } = useForm();

  const formValues = formValuesProp || getState().values;

  const addTag = useCallback(
    ({ inputValue }) => {
      const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
      const updatedTags = get(formValues, name, []).concat(tag).filter(Boolean);

      if (tag) {
        change(name, updatedTags);
        onAdd(tag);
      }
    },
    [change, formValues, name, onAdd],
  );

  const addAction = useMemo(() => ({ onSelect: addTag, render: renderTag }), [addTag]);
  const actions = useMemo(() => [addAction], [addAction]);

  const dataOptions = useMemo(() => allTags.map(tag => tag.label.toLowerCase()).sort(), [allTags]);

  const formatter = useCallback(({ option }) => {
    const item = allTags.filter(tag => tag.label.toLowerCase() === option)[0];

    if (!item) return option;

    return item.label;
  }, [allTags]);

  return (
    <FieldMultiSelectionFinal
      actions={actions}
      dataOptions={dataOptions}
      emptyMessage=" "
      filter={filterArrayValues}
      formatter={formatter}
      fullWidth={fullWidth}
      itemToString={itemToString}
      label={!labelless && label}
      marginBottom0={marginBottom0}
      name={name}
      validateFields={[]}
      {...props}
    />
  );
};

FieldTagsFinal.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.object),
  formValues: PropTypes.object,
  fullWidth: PropTypes.bool,
  labelless: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

FieldTagsFinal.defaultProps = {
  allTags: [],
};

export default FieldTagsFinal;
