import React from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { getOrganizationsOptions } from '../utils';
import { organizationsShape } from '../shapes';

const OrganizationFilter = ({ organizations, ...rest }) => {
  const options = getOrganizationsOptions(organizations);

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

OrganizationFilter.propTypes = {
  organizations: organizationsShape,
};

export default OrganizationFilter;
