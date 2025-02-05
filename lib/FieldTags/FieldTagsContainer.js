import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  stripesConnect,
} from '@folio/stripes/core';

import {
  configTags,
  tagsResource,
} from '../manifests';
import FieldTagsFinal from './FieldTagsFinal';

const FieldTagsContainer = ({
  formValues,
  fullWidth,
  labelless = false,
  marginBottom0,
  mutator,
  name,
  resources,
  ...props
}) => {
  const allTags = get(resources, ['tags', 'records'], []);
  const tagSettings = get(resources, ['configTags', 'records'], []);
  const tagsEnabled = !tagSettings.length || tagSettings[0].value === 'true';

  const onAdd = useCallback(
    (tag) => (
      mutator.tags.POST({
        label: tag,
        description: tag,
      })
    ),
    [],
  );

  if (!tagsEnabled) return null;

  return (
    <FieldTagsFinal
      allTags={allTags}
      formValues={formValues}
      fullWidth={fullWidth}
      labelless={labelless}
      marginBottom0={marginBottom0}
      name={name}
      onAdd={onAdd}
      {...props}
    />
  );
};

FieldTagsContainer.manifest = Object.freeze({
  tags: tagsResource,
  configTags,
});

FieldTagsContainer.propTypes = {
  formValues: PropTypes.object,
  fullWidth: PropTypes.bool,
  labelless: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FieldTagsContainer);
