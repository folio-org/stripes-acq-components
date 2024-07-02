import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';
import {
  useTags,
  useTagsConfigs,
} from '../hooks';

const getTagsOptions = (tags) => {
  return tags.map(tag => ({
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
  tenantId,
}) => {
  const { configs, isFetched } = useTagsConfigs({ tenantId });

  const tagsEnabled = isFetched && (!configs.length || configs[0].value === 'true');

  const { tags } = useTags({
    tenantId,
    enabled: tagsEnabled,
  });

  const tagsOptions = useMemo(() => getTagsOptions(tags), [tags]);

  if (!tagsEnabled) return false;

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <MultiSelectionFilter
        ariaLabelledBy={`accordion-toggle-button-${id}`}
        dataOptions={tagsOptions}
        disabled={disabled}
        id="acq-tags-filter"
        name={name}
        onChange={onChange}
        selectedValues={activeFilters}
      />
    </FilterAccordion>
  );
};

AcqTagsFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tenantId: PropTypes.string,
};

AcqTagsFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
  labelId: 'stripes-acq-components.filter.tags',
};

export default AcqTagsFilter;
