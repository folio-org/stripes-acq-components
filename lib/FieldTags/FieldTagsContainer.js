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
  mutator,
  name,
  resources,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!tagsEnabled) return null;

  return (
    <FieldTagsFinal
      allTags={allTags}
      formValues={formValues}
      name={name}
      onAdd={onAdd}
    />
  );
};

FieldTagsContainer.manifest = Object.freeze({
  tags: tagsResource,
  configTags,
});

FieldTagsContainer.propTypes = {
  formValues: PropTypes.object,
  mutator: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FieldTagsContainer);
