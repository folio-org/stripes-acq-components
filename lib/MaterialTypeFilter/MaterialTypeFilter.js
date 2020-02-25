import React from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { fieldSelectOptionsShape } from '../shapes';

const MaterialTypeFilter = ({ options, ...rest }) => {
  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

MaterialTypeFilter.propTypes = {
  options: fieldSelectOptionsShape,
};

export default MaterialTypeFilter;
