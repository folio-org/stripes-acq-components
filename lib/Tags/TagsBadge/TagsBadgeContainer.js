import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { configTags } from '../../manifests';
import TagsBadge from './TagsBadge';

const TagsBadgeContainer = ({
  disabled,
  resources,
  tagsToggle,
  tagsQuantity,
}) => {
  const tagSettings = get(resources, ['configTags', 'records'], []);
  const tagsEnabled = !tagSettings.length || tagSettings[0].value === 'true';

  return (
    <TagsBadge
      disabled={disabled}
      tagsEnabled={tagsEnabled}
      tagsToggle={tagsToggle}
      tagsQuantity={tagsQuantity}
    />
  );
};

TagsBadgeContainer.manifest = Object.freeze({
  configTags,
});

TagsBadgeContainer.propTypes = {
  disabled: PropTypes.bool,
  resources: PropTypes.object.isRequired,
  tagsToggle: PropTypes.func.isRequired,
  tagsQuantity: PropTypes.number.isRequired,
};

export default stripesConnect(TagsBadgeContainer);
