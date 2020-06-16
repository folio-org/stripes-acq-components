import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import {
  createClearFilterHandler,
} from '../utils';
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
  id,
  labelId,
  name,
  onChange,
  resources,
}) => {
  const tags = useMemo(() => getTagsOptions(resources), [resources]);
  const onClearFilter = useMemo(() => createClearFilterHandler(onChange, name), [onChange, name]);

  const tagSettings = get(resources, ['configTags', 'records'], []);
  const tagsEnabled = !tagSettings.length || tagSettings[0].value === 'true';

  if (!tagsEnabled) return false;

  return (
    <Accordion
      closedByDefault={closedByDefault}
      id={id}
      displayClearButton={Boolean(activeFilters) && activeFilters.length > 0}
      header={FilterAccordionHeader}
      label={<FormattedMessage id={labelId} />}
      onClearFilter={onClearFilter}
    >
      <MultiSelectionFilter
        ariaLabelledBy={id}
        dataOptions={tags}
        id="acq-tags-filter"
        name={name}
        onChange={onChange}
        selectedValues={activeFilters}
      />
    </Accordion>
  );
};

AcqTagsFilter.manifest = Object.freeze({
  tagsFilter: tagsResource,
  configTags,
});

AcqTagsFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

AcqTagsFilter.defaultProps = {
  closedByDefault: true,
  labelId: 'stripes-acq-components.filter.tags',
};

export default stripesConnect(AcqTagsFilter);
