import React from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { fieldSelectOptionShape } from '../shapes';

const MaterialTypeFilter = ({ options, ...rest }) => {
  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

MaterialTypeFilter.propTypes = {
  options: fieldSelectOptionShape,
};

export default MaterialTypeFilter;
