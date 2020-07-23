import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { get } from 'lodash';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import { FilterAccordion } from '../FilterAccordion';
import {
  configTags,
  tagsResource,
} from '../manifests';

const getTagsOptions = resources => {
  return get(resources, 'tagsFilter.records', []).map(tag => ({
    label: tag.label,
    value: tag.label,
  }));
};

const AcqTagsFilter = ({
  activeFilters,
  closedByDefault,
  disabled,
  id,
  labelId,
  name,
  onChange,
  resources,
}) => {
  const tags = useMemo(() => getTagsOptions(resources), [resources]);
  const intl = useIntl();
  const label = useMemo(() => intl.formatMessage({ id: labelId }), [intl, labelId]);

  const tagSettings = get(resources, ['configTags', 'records'], []);
  const tagsEnabled = !tagSettings.length || tagSettings[0].value === 'true';

  if (!tagsEnabled) return false;

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      label={label}
      name={name}
      onChange={onChange}
    >
      <MultiSelectionFilter
        ariaLabelledBy={`accordion-toggle-button-${id}`}
        dataOptions={tags}
        disabled={disabled}
        id="acq-tags-filter"
        name={name}
        onChange={onChange}
        selectedValues={activeFilters}
      />
    </FilterAccordion>
  );
};

AcqTagsFilter.manifest = Object.freeze({
  tagsFilter: tagsResource,
  configTags,
});

AcqTagsFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

AcqTagsFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
  labelId: 'stripes-acq-components.filter.tags',
};

export default stripesConnect(AcqTagsFilter);
